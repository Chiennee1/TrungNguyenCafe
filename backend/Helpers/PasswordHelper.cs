namespace backend.Helpers;

public static class PasswordHelper
{
    public static string HashPassword(string plainPassword)
        => BCrypt.Net.BCrypt.HashPassword(plainPassword, workFactor: 10);

    public static bool VerifyPassword(string plainPassword, string hash)
        => BCrypt.Net.BCrypt.Verify(plainPassword, hash);
}
