using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;

namespace HotelManagement.Services;

public class R2FileUploadService : IFileUploadService
{
    private readonly IAmazonS3 _s3Client;
    private readonly R2Settings _settings;
    private readonly ILogger<R2FileUploadService> _logger;

    public R2FileUploadService(IOptions<R2Settings> settings, ILogger<R2FileUploadService> logger)
    {
        _settings = settings.Value;
        _logger = logger;

        var config = new AmazonS3Config
        {
            ServiceURL = $"https://{_settings.AccountId}.r2.cloudflarestorage.com",
            ForcePathStyle = true
        };

        _s3Client = new AmazonS3Client(
            _settings.AccessKeyId,
            _settings.SecretAccessKey,
            config);
    }

    public async Task<string> UploadFileAsync(IFormFile file, string folder = "id-proofs")
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty or null", nameof(file));
        }

        var fileExtension = Path.GetExtension(file.FileName);
        var uniqueFileName = $"{folder}/{Guid.NewGuid()}{fileExtension}";

        try
        {
            using var stream = file.OpenReadStream();

            var putRequest = new PutObjectRequest
            {
                BucketName = _settings.BucketName,
                Key = uniqueFileName,
                InputStream = stream,
                ContentType = file.ContentType,
                DisablePayloadSigning = true
            };

            await _s3Client.PutObjectAsync(putRequest);

            var fileUrl = string.IsNullOrEmpty(_settings.PublicUrl)
                ? $"https://{_settings.BucketName}.{_settings.AccountId}.r2.cloudflarestorage.com/{uniqueFileName}"
                : $"{_settings.PublicUrl.TrimEnd('/')}/{uniqueFileName}";

            _logger.LogInformation("File uploaded successfully: {FileUrl}", fileUrl);
            return fileUrl;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file to R2: {FileName}", file.FileName);
            throw;
        }
    }

    public async Task<bool> DeleteFileAsync(string fileUrl)
    {
        if (string.IsNullOrEmpty(fileUrl))
        {
            return false;
        }

        try
        {
            var uri = new Uri(fileUrl);
            var key = uri.AbsolutePath.TrimStart('/');

            var deleteRequest = new DeleteObjectRequest
            {
                BucketName = _settings.BucketName,
                Key = key
            };

            await _s3Client.DeleteObjectAsync(deleteRequest);
            _logger.LogInformation("File deleted successfully: {FileUrl}", fileUrl);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file from R2: {FileUrl}", fileUrl);
            return false;
        }
    }
}
