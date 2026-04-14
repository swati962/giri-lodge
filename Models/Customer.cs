using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Models;

public class Customer
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    [Display(Name = "Full Name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Phone]
    [StringLength(20)]
    [Display(Name = "Phone Number")]
    public string Phone { get; set; } = string.Empty;

    [Display(Name = "ID Proof URL")]
    [StringLength(500)]
    public string? IdProofUrl { get; set; }

    [Required]
    [DataType(DataType.Date)]
    [Display(Name = "Check-in Date")]
    public DateTime CheckInDate { get; set; }

    [Required]
    [DataType(DataType.Date)]
    [Display(Name = "Check-out Date")]
    public DateTime CheckOutDate { get; set; }

    [Display(Name = "Is Checked Out")]
    public bool IsCheckedOut { get; set; } = false;

    [Display(Name = "Created At")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
