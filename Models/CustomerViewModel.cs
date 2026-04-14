using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Models;

public class CustomerCreateViewModel
{
    [Required]
    [StringLength(100)]
    [Display(Name = "Full Name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Phone]
    [StringLength(20)]
    [Display(Name = "Phone Number")]
    public string Phone { get; set; } = string.Empty;

    [Display(Name = "ID Proof Document")]
    public IFormFile? IdProofFile { get; set; }

    [Required]
    [DataType(DataType.Date)]
    [Display(Name = "Check-in Date")]
    public DateTime CheckInDate { get; set; } = DateTime.Today;

    [Required]
    [DataType(DataType.Date)]
    [Display(Name = "Check-out Date")]
    public DateTime CheckOutDate { get; set; } = DateTime.Today.AddDays(1);
}
