const mongoose = require('mongoose');
const FixedDepositModel = require('../models/fixedDeposit');
const FdAnalysisModel = require('../models/fdAnalysis');
const { statusCode, message } = require('../utils/api.response');

// Utility function to format the amount
const formatAmount = (amount) => {
    if (amount >= 1000000000) {
        return (amount / 1000000000).toFixed(2) + ' Arab';
    } else if (amount >= 10000000) {
        return (amount / 10000000).toFixed(2) + ' Crore';
    } else if (amount >= 100000) {
        return (amount / 100000).toFixed(2) + ' Lakh';
    } else if(amount < 100000){
        return (amount / 100000).toFixed(2) + 'K';
    }
    return amount.toString();
};

const getFdAnalysis = async (req, res) => {
    try {
        const userId = req.user.id;

        const fdAnalysis = await FixedDepositModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $addFields: {
                    currentDate: new Date(),
                    tenureInYears: {
                        $divide: [
                            { $subtract: ["$maturityDate", "$startDate"] },
                            1000 * 60 * 60 * 24 * 365
                        ]
                    },
                    tenureCompletedYears: {
                        $divide: [
                            { $subtract: [new Date(), "$startDate"] },
                            1000 * 60 * 60 * 24 * 365
                        ]
                    }
                }
            },
            {
                $addFields: {
                    currentReturnAmount: {
                        $round: [
                            {
                                $cond: {
                                    if: { $gte: [new Date(), "$maturityDate"] },
                                    then: {
                                        $multiply: [
                                            "$totalInvestedAmount",
                                            {
                                                $pow: [
                                                    { $add: [1, { $divide: ["$interestRate", 100] }] },
                                                    { $round: ["$tenureInYears", 2] }
                                                ]
                                            }
                                        ]
                                    },
                                    else: {
                                        $multiply: [
                                            "$totalInvestedAmount",
                                            {
                                                $pow: [
                                                    { $add: [1, { $divide: ["$interestRate", 100] }] },
                                                    { $round: ["$tenureCompletedYears", 2] }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },
                            0
                        ]
                    },
                    totalReturnedAmount: {
                        $round: [
                            {
                                $multiply: [
                                    "$totalInvestedAmount",
                                    {
                                        $pow: [
                                            { $add: [1, { $divide: ["$interestRate", 100] }] },
                                            { $round: ["$tenureInYears", 2] }
                                        ]
                                    }
                                ]
                            },
                            0
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalInvestedAmountOfFds: { $sum: "$totalInvestedAmount" },
                    currentReturnAmountOfFds: { $sum: { $round: ["$currentReturnAmount", 0] } },
                    totalReturnAmountofFds: { $sum: "$totalReturnedAmount" } // New field added here
                }
            },
            {
                $addFields: {
                    totalProfitGainedOfFds: {
                        $subtract: ["$currentReturnAmountOfFds", "$totalInvestedAmountOfFds"]
                    }
                }
            }
        ]);

        if (!fdAnalysis || fdAnalysis.length === 0) {
            return res.status(statusCode.OK).json({ statusCode: statusCode.OK, message: message.errorFetchingFD });
        }

        const rawData = {
            totalInvestedAmountOfFds: Math.round(fdAnalysis[0].totalInvestedAmountOfFds),
            currentReturnAmountOfFds: Math.round(fdAnalysis[0].currentReturnAmountOfFds),
            totalReturnAmountofFds: Math.round(fdAnalysis[0].totalReturnAmountofFds), // New field
            totalProfitGainedOfFds: Math.round(fdAnalysis[0].totalProfitGainedOfFds),
            userId: new mongoose.Types.ObjectId(userId)
        };

        const formattedData = {
            totalInvestedAmountOfFds: formatAmount(rawData.totalInvestedAmountOfFds),
            currentReturnAmountOfFds: formatAmount(rawData.currentReturnAmountOfFds),
            totalReturnAmountofFds: formatAmount(rawData.totalReturnAmountofFds), // New field
            totalProfitGainedOfFds: formatAmount(rawData.totalProfitGainedOfFds),
            userId: rawData.userId
        };

        const filter = { userId: new mongoose.Types.ObjectId(userId) };
        const update = { $set: rawData };
        const options = { upsert: true, new: true };
        await FdAnalysisModel.findOneAndUpdate(filter, update, options);

        res.status(statusCode.OK).json({ statusCode: statusCode.OK, message: message.analysisReportofFd, data: formattedData });
    } catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ statusCode: statusCode.INTERNAL_SERVER_ERROR, message: message.errorFdAnalytics, error: error.message });
    }
};

const getFdAnalysisbyNumber = async (req, res) => {
    try {
        const userId = req.user.id;

        const fdAnalysis = await FixedDepositModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $addFields: {
                    tenureInYears: {
                        $divide: [
                            { $subtract: ["$maturityDate", "$startDate"] },
                            1000 * 60 * 60 * 24 * 365
                        ]
                    },
                    tenureCompletedYears: {
                        $divide: [
                            { $subtract: [new Date(), "$startDate"] },
                            1000 * 60 * 60 * 24 * 365
                        ]
                    }
                }
            },
            {
                $addFields: {
                    // Simple Interest Calculation for Maturity Amount
                    totalReturnedAmount: {
                        $trunc: {
                            $add: [
                                "$totalInvestedAmount",
                                { 
                                    $multiply: [
                                        "$totalInvestedAmount", 
                                        { $multiply: ["$interestRate", "$tenureInYears", 0.01] }
                                    ]
                                }
                            ]
                        }
                    },
                    currentReturnAmount: {
                        $trunc: {
                            $add: [
                                "$totalInvestedAmount",
                                { 
                                    $multiply: [
                                        "$totalInvestedAmount", 
                                        { $multiply: ["$interestRate", "$tenureCompletedYears", 0.01] }
                                    ]
                                }
                            ]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalInvestedAmountOfFds: { $sum: "$totalInvestedAmount" },
                    currentReturnAmountOfFds: { $sum: "$currentReturnAmount" },
                    totalReturnAmountofFds: { $sum: "$totalReturnedAmount" }
                }
            },
            {
                $addFields: {
                    totalProfitGainedOfFds: {
                        $trunc: {
                            $subtract: ["$currentReturnAmountOfFds", "$totalInvestedAmountOfFds"]
                        }
                    }
                }
            }
        ]);

        if (!fdAnalysis || fdAnalysis.length === 0) {
            return res.status(statusCode.OK).json({ statusCode: statusCode.OK, message: message.errorFetchingFD });
        }

        const rawData = {
            totalInvestedAmountOfFds: Math.round(fdAnalysis[0].totalInvestedAmountOfFds),
            currentReturnAmountOfFds: Math.round(fdAnalysis[0].currentReturnAmountOfFds),
            totalReturnAmountofFds: Math.round(fdAnalysis[0].totalReturnAmountofFds),
            totalProfitGainedOfFds: Math.round(fdAnalysis[0].totalProfitGainedOfFds),
            userId: new mongoose.Types.ObjectId(userId)
        };

        const formattedData = {
            totalInvestedAmountOfFds: formatAmount(rawData.totalInvestedAmountOfFds),
            currentReturnAmountOfFds: formatAmount(rawData.currentReturnAmountOfFds),
            totalReturnAmountofFds: formatAmount(rawData.totalReturnAmountofFds),
            totalProfitGainedOfFds: formatAmount(rawData.totalProfitGainedOfFds),
            userId: rawData.userId
        };

        res.status(statusCode.OK).json({ statusCode: statusCode.OK, message: message.analysisReportofFd, data: rawData });
    } catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ statusCode: statusCode.INTERNAL_SERVER_ERROR, message: message.errorFdAnalytics, error: error.message });
    }
};







module.exports = {
    getFdAnalysis,
    getFdAnalysisbyNumber
};
