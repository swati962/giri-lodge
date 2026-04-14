namespace HotelManagement.Services;

public interface IFileUploadService
{
    Task<string> UploadFileAsync(IFormFile file, string folder = "id-proofs");
    Task<bool> DeleteFileAsync(string fileUrl);
}
