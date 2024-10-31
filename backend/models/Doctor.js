import mongoose from "mongoose";    

const doctorScheema  = new mongoose.Schema({
    ratingAndReviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "RatingAndReview",
		},
	],
});

const Doctor = mongoose.model("Doctor",doctorScheema);
export default Doctor;