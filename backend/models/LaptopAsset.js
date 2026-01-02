const mongoose = require("mongoose");
const FileSchema = require("./common/FileSchema");

const LaptopAssetSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
            trim: true,
        },

        model: {
            type: String,
            trim: true,
        },

        serialNo: {
            type: String,
            trim: true,
        },

        assetCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", //  Super Admin Created User
            required: true,
        },

        officialEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        employeeEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },

        remarks: {
            type: String,
            trim: true,
        },

        purchaseDate: {
            type: Date,
        },

        assetCondition: {
            type: String,
            enum: ["New", "Refurbished", "Rented"],
        },

        purchasedFrom: {
            type: String,
            trim: true,
        },

        warranty: {
            type: Number,
        },

        antivirusStart: {
            type: Date,
        },

        antivirusEnd: {
            type: Date,
        },

        ram: {
            type: String,
        },

        storage: {
            type: String,
        },

        processor: {
            type: String,
        },

        images: {
            type: [FileSchema],
            validate: [
                {
                    validator: function (v) {
                        return v.length > 0;
                    },
                    message: "At least one image is required",
                },
            ],
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LaptopAsset", LaptopAssetSchema);
