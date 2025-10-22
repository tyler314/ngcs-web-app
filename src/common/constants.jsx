const IMAGE_API =
  "https://byjn6jzhbvipxyu6qkyh2gbnn40ltgvn.lambda-url.us-east-2.on.aws/";

const BANNER_IMAGE_URI =
  "https://ngcs-website-images.s3.us-east-2.amazonaws.com/landing-page-banner.jpg";

const GYM_SCHEDULE =
  "https://ngwb-public-forms.s3.us-east-2.amazonaws.com/NGCS_Schedule.pdf";

const INSTRUCTORS_API =
  "https://kxanxtcodnphw6o2txqqphuede0ipyzm.lambda-url.us-east-2.on.aws/";

const PROGRAMS_API =
  "https://cxy6ojnr25yufgsvlbcjm6v2ca0akviq.lambda-url.us-east-2.on.aws/";

const CONTACT_INFO_API =
  "https://haoetrbe34xdi6o6m6drrmpxfy0ccngv.lambda-url.us-east-2.on.aws/";

// S3 bucket for instructor images
const S3_INSTRUCTORS_BUCKET_URL =
  "https://ngcs-instructors.s3.us-east-2.amazonaws.com/";
const DEFAULT_INSTRUCTOR_IMAGE = "default-instructor.jpg";

export {
  IMAGE_API,
  BANNER_IMAGE_URI,
  GYM_SCHEDULE,
  INSTRUCTORS_API,
  PROGRAMS_API,
  CONTACT_INFO_API,
  S3_INSTRUCTORS_BUCKET_URL,
  DEFAULT_INSTRUCTOR_IMAGE,
};

export const navTabsData = [
  { label: "About Us", path: "/" },
  { label: "Programs", path: "/programs" },
  { label: "Schedule", path: "/schedule" },
  { label: "Instructors", path: "/instructors" },
  { label: "Contact Us", path: "/contact", isSpecial: true },
];
