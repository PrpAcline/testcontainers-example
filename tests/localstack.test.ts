import { expect, describe, it, beforeAll, afterAll } from "vitest";
import {
  LocalstackContainer,
  StartedLocalStackContainer,
} from "@testcontainers/localstack";
import {
  S3Client as S3,
  CreateBucketCommand,
  ListBucketsCommand,
} from "@aws-sdk/client-s3";
import { streamToString } from "testcontainers/build/common";

describe("testcontainers", () => {
  let localstack: StartedLocalStackContainer;

  beforeAll(async () => {
    localstack = await new LocalstackContainer()
      .withEnvironment({ SERVICES: "s3" })
      .start();
  }, 30000);

  afterAll(async () => {
    await localstack.stop();
  }, 30000);

  it("localstack works!", { timeout: 60000 }, async () => {
    const s3 = new S3({
      region: "us-east-2",
      endpoint: localstack.getConnectionUri(),
    });

    // const preListRes = await s3.send(new ListBucketsCommand());
    // expect(preListRes.Buckets?.length).toBe(0);

    // await s3.send(new CreateBucketCommand({ Bucket: "example-bucket" }));

    // const postListRes = await s3.send(new ListBucketsCommand());
    // expect(postListRes.Buckets?.length).toBe(1);

    // console.log(await streamToString(await localstack.logs()));
    console.log(
      await fetch(localstack.getConnectionUri() + `/_localstack/health`)
        .then((x) => x.text())
        .then((x) => {
          console.log(x);
          return x;
        }),
    );
  });
});
