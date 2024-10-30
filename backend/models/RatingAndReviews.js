import mongoose from "mongoose";

const ratingAndReviewsSchema = new mongoose.Schema({
    patient_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
        required:true,
    },
    doctor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true,
    },
    rating: {
		type: Number,
		required: true,
	},
	review: {
		type: String,
    },
});

const RatingAndReview = mongoose.model("RatingAndReviews",ratingAndReviewsSchema);
export default RatingAndReview;