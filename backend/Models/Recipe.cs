using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Recipe
{
    public Guid RecipeId { get; set; }
    public Guid ProductId { get; set; }
    public Guid IngredientId { get; set; }
    [Column(TypeName = "decimal(10,3)")]
    public decimal FAmountRequired { get; set; }
    [MaxLength(100)]
    public string? SNote { get; set; }

    // Navigation
    public Product Product { get; set; } = null!;
    public Ingredient Ingredient { get; set; } = null!;
}
