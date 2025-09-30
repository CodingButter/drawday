import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface RegisterProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

export function Register({ onSuccess, onLoginClick }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    const { data, error: authError } = await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          onSuccess?.();
        },
        onError: (ctx) => {
          setIsLoading(false);
          setError(ctx.error.message || "Failed to create account");
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Create an account
        </h1>
        <p className="text-muted-foreground">
          Enter your information to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            className={cn(
              "w-full px-3 py-2 text-sm rounded-md",
              "bg-background border border-input",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="register-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className={cn(
              "w-full px-3 py-2 text-sm rounded-md",
              "bg-background border border-input",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <input
            id="register-password"
            type="password"
            placeholder="Enter a password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className={cn(
              "w-full px-3 py-2 text-sm rounded-md",
              "bg-background border border-input",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirm-password"
            className="text-sm font-medium text-foreground"
          >
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            className={cn(
              "w-full px-3 py-2 text-sm rounded-md",
              "bg-background border border-input",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full px-4 py-2 text-sm font-medium rounded-md",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?{" "}
          </span>
          <button
            type="button"
            onClick={onLoginClick}
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
