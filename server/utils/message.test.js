const expect = require("expect");
const { generateMessage, generateLocationMessage } = require("./message");

describe("generateMessage()", () => {
  it("should generate correct message object", () => {
    const from = "jen";
    const text = "some-menssage";
    const message = generateMessage(from, text);

    expect(message.createdAt).toEqual(expect.any(Number));
    expect(message).toMatchObject({
      from,
      text
    });
  });
});

describe("generateLocationMessage()", () => {
  it("should generate proper message object", () => {
    const from = "jen";

    const message = generateLocationMessage(from, 1, 2);

    expect(message.createdAt).toEqual(expect.any(Number));
    expect(message).toMatchObject({
      from,
      url: "https://www.google.com/maps?q=1,2"
    });
  });
});
