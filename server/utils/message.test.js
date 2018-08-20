const expect = require("expect");
const { generateMessage } = require("./message");

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
