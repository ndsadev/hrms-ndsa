const mongoose = require("mongoose");
const FileSchema = require("./common/FileSchema");

const PreboardingProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        employeeId: {
            type: String,
            required: true,
            index: true,
        },

        // Personal Detail
        personalDetails: {
            firstName: { type: String, required: true },
            middleName: String,
            lastName: { type: String, required: true },

            dob: Date,
            email: String,
            phone: String,
            bloodGroup: String,
            address: String,

            profilePic: FileSchema,
        },

        // Education Detail
        education: [
            {
                qualification: {
                    type: String,
                    required: true,
                    trim: true,
                },

                university: {
                    type: String,
                    trim: true,
                },

                passingYear: {
                    type: Number,
                    min: 1950,
                    max: new Date().getFullYear(),
                },

                semesterResults: [
                    {
                        semester: {
                            type: Number, // 1,2,3,4,5,6
                            required: true,
                        },
                        file: FileSchema,
                    },
                ],
            },
        ],


        // Certificate 
        certifications: [
            {
                name: String,
                file: FileSchema,
            },
        ],

        // Experience Detail
        experiences: [
            {
                company: String,
                designation: String,
                startDesignation: String,
                endDesignation: String,
                startDate: Date,
                endDate: Date,

                offerLetter: FileSchema,
                experienceLetter: FileSchema,
                appointmentLetter: FileSchema,
                salarySlip: FileSchema,
            },
        ],

        // Bank Detail
        bankDetails: {
            accountHolder: String,
            bankName: String,
            branch: String,
            bankEmail: String,
            bankPhone: String,
            accountNo: String,
            ifsc: String,
            registerNo: String,

            aadharNo: String,
            aadharFile: FileSchema,

            panNo: String,
            panFile: FileSchema,

            cancelCheque: FileSchema,
        },

        // Emergency contact Detail
        emergencyContact: {
            name: String,
            relation: String,
            phone: String,
            alternatePhone: String,
            address: String,
        },

        status: {
            type: String,
            enum: ["IN_PROGRESS", "SUBMITTED", "VERIFIED"],
            default: "IN_PROGRESS",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "PreboardingProfile",
    PreboardingProfileSchema
);
