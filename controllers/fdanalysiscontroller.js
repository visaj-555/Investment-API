const mongoose = require('mongoose');
const FixedDepositModel = require('../models/FixedDeposit');
const FdAnalysisModel = require('../models/FdAnalysis');

const getFdAnalysis = async (req, res) => {
    try {
        // Aggregate pipeline to calculate analysis data for Fixed Deposits
        const fdAnalysis = await FixedDepositModel.aggregate([
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
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalInvestedAmountOfFds: { $sum: "$totalInvestedAmount" },
                    currentReturnAmountOfFds: { $sum: { $round: ["$currentReturnAmount", 0] } }
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

        // Handle case where no FDs are found
        if (!fdAnalysis || fdAnalysis.length === 0) {
            return res.status(404).json({ message: 'No Fixed Deposits found' });
        }

        // Prepare analysis data for response
        const analysisData = {
            totalInvestedAmountOfFds: Math.round(fdAnalysis[0].totalInvestedAmountOfFds),
            currentReturnAmountOfFds: Math.round(fdAnalysis[0].currentReturnAmountOfFds),
            totalProfitGainedOfFds: Math.round(fdAnalysis[0].totalProfitGainedOfFds)
        };

        // Update or insert analysis data into FdAnalysisModel
        const filter = {};
        const update = { $set: analysisData };
        const options = { upsert: true, new: true };
        const updatedFdAnalysis = await FdAnalysisModel.findOneAndUpdate(filter, update, options);

        // Log updated FD Analysis
        console.log("Updated FD Analysis:", updatedFdAnalysis);

        // Respond with analysis data
        res.status(200).json({
            statusCode: 200,
            message: "Analysis Report of all the fixed deposits",
            ...analysisData
        });
    } catch (error) {
        // Handle errors
        console.error("Error calculating FD analytics:", error);
        res.status(500).json({ statusCode: 500, message: "Error calculating FD analytics", error });
    }
};

module.exports = {
    getFdAnalysis
};
