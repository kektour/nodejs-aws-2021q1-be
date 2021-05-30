import { S3Handler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as csvParser from 'csv-parser';
import 'source-map-support/register';
import { Readable } from 'stream';

import { getEnvVar } from '@libs/common';

const parseCSVAsync = (stream: Readable): Promise<void> => {
  return new Promise((resolve, reject) => {
    stream
      .pipe(csvParser())
      .on('error', reject)
      .on('data', (line: Record<string, string>) => {
        console.log(line);
      })
      .on('end', resolve);
  });
};

const importFileParser: S3Handler = async (event) => {
  const s3 = new AWS.S3({ region: getEnvVar('AWS_GENERAL_REGION') });

  for (const record of event.Records) {
    const s3OriginFileParams = {
      Bucket: getEnvVar('IMPORT_SERVICE_BUCKET'),
      Key: record.s3.object.key,
    };
    const originFileStream = s3.getObject(s3OriginFileParams).createReadStream();

    await parseCSVAsync(originFileStream);

    await s3
      .copyObject({
        CopySource: s3OriginFileParams.Bucket + '/' + s3OriginFileParams.Key,
        Bucket: s3OriginFileParams.Bucket,
        Key: s3OriginFileParams.Key.replace('uploaded', 'parsed'),
      })
      .promise();

    await s3.deleteObject(s3OriginFileParams).promise();
  }
};

export const main = importFileParser;
