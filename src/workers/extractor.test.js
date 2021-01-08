const axios = require("axios").default;
const extractor = require("./extractor");

jest.mock("axios");

describe("extractor worker", () => {
  it("A worker should return stringified object that contains the main content of the webpage.", async () => {
    axios.get.mockResolvedValueOnce({
      data: "<body>Here's a bunch of text</body>",
    });

    const result = await extractor({
      data: {
        url: "http://www.some_url.com",
      },
    });

    const { textContent } = JSON.parse(result);
    expect(textContent).toBe("Here's a bunch of text");
  });

  it("A worker should throw error when empty url is given.", async () => {
    const error = await extractor({
      data: {
        url: null,
      },
    });

    expect(error.message).toBe(`Empty URL was given. Please provide a url.`);
  });
});
