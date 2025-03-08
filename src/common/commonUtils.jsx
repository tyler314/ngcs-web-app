import { useState, useEffect } from 'react';
import companyInfo from "../../config/companyInfo.json";
import "./comonUtils.css"

const aws_cloudfront_domain_name = "https://d1nqkkjom3zmdm.cloudfront.net";
const aws_s3_domain_name = "https://ch-website-images.s3.us-west-1.amazonaws.com"

function getGoogleMapUrl() {
    var urlAddress = "https://www.google.com/maps/place/"
    for (var i = 0; i < companyInfo.physicalAddress.length; i++){
      urlAddress += companyInfo.physicalAddress[i].split(" ").join("+") + ",+"
    }
    return urlAddress.substring(0, urlAddress.length - 2)
  }

const GetS3CloudFrontJson = (props) => {
    const [json, setJson] = useState({});

    async function fetchData() {
        const response = await fetch(props.filePath);
        setJson(await response.json());
      }

      useEffect(() => {
        fetchData();
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []);

      return json
}

export {
    aws_cloudfront_domain_name,
    aws_s3_domain_name,
    GetS3CloudFrontJson
}