import { S3Handler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as csvParser from 'csv-parser';
import 'source-map-support/register';

import { getEnvVar, getUUID } from '@libs/common';

const importFileParser: S3Handler = async (event) => {
  const s3 = new AWS.S3({ region: getEnvVar('AWS_GENERAL_REGION') });
  const sqs = new AWS.SQS();

  for (const record of event.Records) {
    const s3OriginFileParams = {
      Bucket: getEnvVar('IMPORT_SERVICE_BUCKET'),
      Key: record.s3.object.key,
    };

    const originFileStream = s3.getObject(s3OriginFileParams).createReadStream();
    const csvStream = originFileStream.pipe(csvParser());

    const groupId = getUUID();

    for await (const jsonLine of csvStream) {
      await sqs
        .sendMessage({
          QueueUrl: getEnvVar('SQS_URL'),
          MessageGroupId: groupId,
          MessageDeduplicationId: getUUID(),
          MessageBody: JSON.stringify({ meta: {}, product: jsonLine }),
        })
        .promise();
      console.log('Message sent: ', jsonLine);
    }
    await sqs
      .sendMessage({
        QueueUrl: getEnvVar('SQS_URL'),
        MessageGroupId: groupId,
        MessageDeduplicationId: getUUID(),
        MessageBody: JSON.stringify({ meta: { isFinished: true }, product: {} }),
      })
      .promise();
    console.log('Finish Message sent');

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
