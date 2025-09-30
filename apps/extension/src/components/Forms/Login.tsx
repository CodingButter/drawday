import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface LoginProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

export function Login({ onSuccess, onRegisterClick }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { data, error: authError } = await authClient.signIn.email(
      {
        email,
        password,
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
          setError(ctx.error.message || "Invalid email or password");
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="text-muted-foreground">
          Enter your credentials to sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="email"
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
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
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
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <button
            type="button"
            onClick={onRegisterClick}
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
