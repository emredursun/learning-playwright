// api.spec.ts

import { test, expect } from "@playwright/test";

// Best Practice: Define the API base URL as a single constant
const API_BASE_URL = "https://api.practicesoftwaretesting.com";

test.describe("API Tests: Products and Authentication", () => {
  // --- Test 1: GET /products ---
  test("Validate GET /products returns expected data", async ({ request }) => {
    // Conciseness: Use interpolation for cleaner URL creation
    const response = await request.get(`${API_BASE_URL}/products`);

    // Best Practice 1: Use specific assertions for robust checks
    await expect(response.status()).toBe(200);

    const body = await response.json();

    // Best Practice 2: Assert against the expected structure and data
    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBe(true);

    expect(body.data.length).toBe(9);
    expect(body.total).toBe(50);
  });

  // --- Test 2: POST /users/login ---
  test("Validate successful POST /users/login returns token", async ({ request }) => {
    const loginCredentials = {
      email: "customer@practicesoftwaretesting.com",
      password: "welcome01",
    };

    const response = await request.post(`${API_BASE_URL}/users/login`, {
      // Best Practice 3: Define explicit data and headers for POST requests
      data: loginCredentials,
      headers: {
        "Content-Type": "application/json",
      },
    });

    await expect(response.status()).toBe(200);

    const body = await response.json();

    // Best Practice 4: Assert token presence and type for security checks
    expect(body).toHaveProperty("access_token");
    expect(body.access_token).toBeTruthy();
    expect(typeof body.access_token).toBe("string");

    expect(body.expires_in).toBe(300);
  });
});
