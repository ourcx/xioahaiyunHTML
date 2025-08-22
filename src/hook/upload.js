import COS from 'cos-js-sdk-v5'

const COS_CONFIG = {
  Bucket: 'http://cdn.norubias.top',
  Region: 'ap-guangzhou'
}

const cosInstance = new COS({

})

let uploadId;

/**
 * 初始化分片上传任务
 */
export function InitUpload(file, key) {
  return new Promise((resolve, reject) => {
    cosInstance.multipartInit(
      {
        ...COS_CONFIG,
        Key: key,
        Body: file
      },
      function (err, data) {
        if (err) {
          console.error('初始化分片上传失败:', err);
          return reject(err);
        }
        uploadId = data.UploadId;
        resolve({ uploadId });
      }
    );
  });
}

/**
 * 上传单个分片
 */
export function uploadPart({ key, partNumber, chunk, uploadId }) {
  return new Promise((resolve, reject) => {
    cosInstance.multipartUpload(
      {
        ...COS_CONFIG,
        Key: key,
        PartNumber: partNumber,
        UploadId: uploadId,
        Body: chunk
      },
      (err, data) => {
        if (err) {
          console.error(`上传分片 ${partNumber} 失败`, err);
          return reject(err);
        }
        resolve({
          PartNumber: partNumber,
          ETag: data.ETag
        });
      }
    );
  });
}

/**
 * 完成分片上传
 */
export function completeMultipartUpload({ key, uploadId, parts }) {
  return new Promise((resolve, reject) => {
    cosInstance.multipartComplete(
      {
        ...COS_CONFIG,
        Key: key,
        UploadId: uploadId,
        Parts: parts
      },
      (err, data) => {
        if (err) {
          console.error('完成上传失败', err);
          return reject(err);
        }
        resolve(data.Location); // 返回文件访问地址
      }
    );
  });
}

/**
 * 中止分片上传任务
 */
export function abortMultipartUpload({ key, uploadId }) {
  return new Promise((resolve, reject) => {
    cosInstance.multipartAbort(
      {
        ...COS_CONFIG,
        Key: key,
        UploadId: uploadId
      },
      (err, data) => {
        if (err) {
          console.error('中止上传失败', err);
          return reject(err);
        }
        resolve();
      }
    );
  });
}

/**
 * 查询当前正在进行的分片上传任务
 */
export function listMultipartUploads(params = {}) {
  const config = {
    ...COS_CONFIG,
    ...params
  }

  return new Promise((resolve, reject) => {
    cosInstance.multipartList(config, (err, data) => {
      if (err) {
        console.error('列出分片上传任务失败:', err)
        return reject(err)
      }
      resolve(data)
    })
  })
}
