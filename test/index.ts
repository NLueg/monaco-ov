import { Selector, ClientFunction } from "testcafe";

fixture("Test")
  .page("http://localhost:8000")
  .afterEach(async t => {
    const { error } = await t.getBrowserConsoleMessages();

    await t.expect(error[0]).notOk();
  });

test("Catch console.log", async t => {
  await t.click(Selector("#monaco-editor")).wait(4000);
  const generatedCodeLines = Selector("#generated-code .view-lines");

  await t.expect(generatedCodeLines.childElementCount).notEql(1);
});
