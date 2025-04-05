const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({

    email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},

});

//define a function to send the email
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(
            email,
            "Verification mail from Lucknow University",
            otp

        )
        console.log("email sent Successfullt", mailResponse);

    }
    catch(error){
        console.log("error occurred while sending email ", error);
        throw(error);

    }
}
// define a pre save hook to send email before the document has been saved 
    OTPSchema.pre("save",async function(next) {
        await sendVerificationEmail(this.email, this.otp);
        next();

    });

    


module.exports = mongoose.model("OTP",OTPSchema);