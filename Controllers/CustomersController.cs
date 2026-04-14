using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Data;
using HotelManagement.Models;
using HotelManagement.Services;

namespace HotelManagement.Controllers;

public class CustomersController : Controller
{
    private readonly HotelDbContext _context;
    private readonly IFileUploadService _fileUploadService;
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(
        HotelDbContext context,
        IFileUploadService fileUploadService,
        ILogger<CustomersController> logger)
    {
        _context = context;
        _fileUploadService = fileUploadService;
        _logger = logger;
    }

    // GET: Customers
    public async Task<IActionResult> Index(string? searchPhone)
    {
        var query = _context.Customers.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchPhone))
        {
            query = query.Where(c => c.Phone.Contains(searchPhone));
            ViewData["SearchPhone"] = searchPhone;
        }

        var customers = await query
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return View(customers);
    }

    // GET: Customers/Details/5
    public async Task<IActionResult> Details(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound();
        }

        return View(customer);
    }

    // GET: Customers/Create
    public IActionResult Create()
    {
        return View(new CustomerCreateViewModel());
    }

    // POST: Customers/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(CustomerCreateViewModel viewModel)
    {
        if (!ModelState.IsValid)
        {
            return View(viewModel);
        }

        if (viewModel.CheckOutDate <= viewModel.CheckInDate)
        {
            ModelState.AddModelError("CheckOutDate", "Check-out date must be after check-in date.");
            return View(viewModel);
        }

        try
        {
            string? idProofUrl = null;

            if (viewModel.IdProofFile != null && viewModel.IdProofFile.Length > 0)
            {
                idProofUrl = await _fileUploadService.UploadFileAsync(viewModel.IdProofFile);
            }

            var customer = new Customer
            {
                Name = viewModel.Name,
                Phone = viewModel.Phone,
                IdProofUrl = idProofUrl,
                CheckInDate = viewModel.CheckInDate,
                CheckOutDate = viewModel.CheckOutDate,
                IsCheckedOut = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            TempData["Success"] = "Customer added successfully!";
            return RedirectToAction(nameof(Index));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating customer");
            ModelState.AddModelError("", "An error occurred while saving the customer. Please try again.");
            return View(viewModel);
        }
    }

    // POST: Customers/Checkout/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Checkout(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound();
        }

        customer.IsCheckedOut = true;
        await _context.SaveChangesAsync();

        TempData["Success"] = $"Customer {customer.Name} has been checked out successfully!";
        return RedirectToAction(nameof(Index));
    }

    // POST: Customers/Delete/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound();
        }

        // Delete ID proof file from R2 if exists
        if (!string.IsNullOrEmpty(customer.IdProofUrl))
        {
            await _fileUploadService.DeleteFileAsync(customer.IdProofUrl);
        }

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();

        TempData["Success"] = "Customer deleted successfully!";
        return RedirectToAction(nameof(Index));
    }
}
