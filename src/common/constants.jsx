const IMAGE_API =
  "https://l4ntih2s43iaybgsadwp5b2xka0yxyup.lambda-url.us-east-2.on.aws";

const BANNER_IMAGE_URI =
  "https://ngcs-website-images.s3.us-east-2.amazonaws.com/landing-page-banner.jpg";

const GYM_SCHEDULE =
  "https://ngwb-public-forms.s3.us-east-2.amazonaws.com/NGCS_Schedule.pdf";

const INSTRUCTORS_API = "https://kxanxtcodnphw6o2txqqphuede0ipyzm.lambda-url.us-east-2.on.aws/";

// S3 bucket for instructor images
const S3_INSTRUCTORS_BUCKET_URL = "https://ngcs-instructors.s3.us-east-2.amazonaws.com/";
const DEFAULT_INSTRUCTOR_IMAGE = "default-instructor.jpg";

export { 
  IMAGE_API, 
  BANNER_IMAGE_URI, 
  GYM_SCHEDULE, 
  INSTRUCTORS_API,
  S3_INSTRUCTORS_BUCKET_URL,
  DEFAULT_INSTRUCTOR_IMAGE
};

export const navTabsData = [
  { label: "About Us", path: "/" },
  { label: "Programs", path: "/" },
  { label: "Schedule", path: GYM_SCHEDULE },
  { label: "Instructors", path: "/instructors" },
  { label: "Contact Us", path: "/", isSpecial: true },
];