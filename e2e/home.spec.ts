import { expect, test } from "@playwright/test";

const mobileProjects = new Set(["pixel-7", "iphone-13"]);

test("homepage lifecycle and navigation fit the device", async ({ page }, testInfo) => {
  await page.goto("./");

  const lifecycle = page.getByTestId("build-lifecycle");

  await expect(page).toHaveTitle(/Aangan Buildworks/);
  await expect(page.getByRole("heading", { level: 1, name: /Build the home/ })).toBeVisible();
  await expect(lifecycle.getByRole("heading", { name: "Your land", exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: /Empty residential plot/ })).toBeVisible();
  await expect(lifecycle.getByRole("heading", { name: "Foundation", exact: true })).toBeVisible({
    timeout: 10_000,
  });

  const mobile = mobileProjects.has(testInfo.project.name);
  if (mobile) {
    await expect(page.getByTestId("desktop-navigation")).toHaveCount(0);
    await page.getByTestId("mobile-menu-button").click();
    await expect(page.getByTestId("mobile-nav-services-link")).toBeVisible();
    await expect(page.getByTestId("mobile-nav-contact-link")).toBeVisible();
  } else {
    await expect(page.getByTestId("desktop-navigation")).toBeVisible();
    await expect(page.getByTestId("nav-services-link")).toBeVisible();
    await expect(page.getByTestId("mobile-menu-button")).toBeHidden();
  }
});

test("contact page opens from the site", async ({ page }, testInfo) => {
  await page.goto("./");
  const mobile = mobileProjects.has(testInfo.project.name);
  if (mobile) {
    await page.getByTestId("mobile-menu-button").click();
    await page.getByTestId("mobile-nav-contact-link").click();
  } else {
    await page.getByTestId("nav-contact-link").click();
  }
  await expect(page.getByRole("heading", { name: /Let’s start with your land/ })).toBeVisible();
});
