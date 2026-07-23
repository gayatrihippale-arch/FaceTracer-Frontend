const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess(false);

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    const data = {
      name,
      email,
      phone,
      password,
      role,
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || "Registration failed. Please try again.");
    }

    setSuccess(true);

    setTimeout(() => {
      navigate("/login");
    }, 2000);

  } catch (err) {
    setError(err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};