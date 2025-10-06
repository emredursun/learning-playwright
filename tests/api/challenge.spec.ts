import { test, expect } from "@playwright/test";

test.describe("API Challenge Tests - Products", () => {
  test('Get /products/{id} for "Thor Hammer" should return correct details', async ({
    request,
  }) => {
    const API_BASE_URL = "https://api.practicesoftwaretesting.com"; // 1. Search for the Product ID
    const searchResponse = await request.get(
      `${API_BASE_URL}/products/search`,
      {
        params: {
          q: "thor hammer", // Playwright handles URL encoding
        },
      }
    );

    await expect(searchResponse).toBeOK();

    const productBody = await searchResponse.json();

    const productId = productBody.data?.[0]?.id; // Use optional chaining

    expect(productId, "Product ID not found in search results.").toBeDefined(); // 2. Get Product by ID
    const response = await request.get(`${API_BASE_URL}/products/${productId}`);

    await expect(response).toBeOK();

    const body = await response.json(); // 3. Assert Product Details
    expect(body.in_stock).toBe(true);
    expect(body.is_location_offer).toBe(false);
    expect(body.is_rental).toBe(false);
    expect(body.name).toBe("Thor Hammer");
    expect(body.price).toBe(11.14);
  });
});
