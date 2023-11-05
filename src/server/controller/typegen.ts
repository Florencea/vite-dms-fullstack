import { Router } from "express";
import {
  InputData,
  Options,
  jsonInputForTargetLanguage,
  quicktype,
} from "quicktype-core";

const typegenController = Router();

const TYPEGEN_CONFIG: Record<string, Partial<Options>> = {
  typescript: {
    lang: "typescript",
    rendererOptions: { "just-types": "true" },
    indentation: "  ",
  },
  java: {
    lang: "java",
    rendererOptions: { "just-types": "true", package: "com.example" },
  },
  csharp: {
    lang: "C#",
    rendererOptions: { features: "just-types", namespace: "Example" },
  },
};

typegenController.post("/:lang", async (req, res) => {
  try {
    const { lang } = req.params;
    const jsonInput = jsonInputForTargetLanguage(lang);
    await jsonInput.addSource({
      name: "Example",
      samples: [JSON.stringify(req.body)],
    });
    const inputData = new InputData();
    inputData.addInput(jsonInput);
    const result = await quicktype({
      inputData,
      ...TYPEGEN_CONFIG[lang],
    });
    res.json(result.lines);
  } catch (err) {
    res.json([JSON.stringify(err)]);
  }
});

export default typegenController;
