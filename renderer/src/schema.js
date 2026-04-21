import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, coerceTypes: false });
addFormats(ajv);

const configSchema = {
  type: 'object',
  additionalProperties: true,
  properties: {
    canvas_width:       { type: 'number', minimum: 100, maximum: 4096 },
    canvas_height:      { type: 'number', minimum: 100, maximum: 8192 },
    background_color:   { type: 'string' },
    is_gradient:        { type: 'boolean' },
    gradient_start:     { type: 'string' },
    gradient_end:       { type: 'string' },
    gradient_angle:     { type: 'number', minimum: 0, maximum: 360 },
    text_color:         { type: 'string' },
    accent_color:       { type: 'string' },
    font_family:        { type: 'string' },
    font_size:          { type: 'number', minimum: 8, maximum: 72 },
    padding:            { type: 'number', minimum: 0, maximum: 200 },
    line_height:        { type: 'number', minimum: 1, maximum: 4 },
    paragraph_spacing:  { type: 'number', minimum: 0, maximum: 100 },
    author:             { type: 'string' },
    timestamp:          { type: 'string' },
    meta_position:      { type: 'string', enum: ['top', 'bottom'] },
    watermark_enable:   { type: 'boolean' },
    watermark_text:     { type: 'string' },
    watermark_opacity:  { type: 'number', minimum: 0, maximum: 1 },
    watermark_size:     { type: 'number', minimum: 6, maximum: 200 },
    watermark_angle:    { type: 'number', minimum: -180, maximum: 180 },
    watermark_color:    { type: 'string' },
    watermark_gap:      { type: 'number', minimum: 20, maximum: 800 },
    auto_height:        { type: 'boolean' },
    export_format:      { type: 'string', enum: ['png', 'jpeg', 'webp'] },
    export_scale:       { type: 'number', enum: [1, 2, 3] },
    export_quality:     { type: 'number', minimum: 0.01, maximum: 1 },
  },
};

const renderSchema = {
  type: 'object',
  required: ['markdown'],
  additionalProperties: false,
  properties: {
    markdown: { type: 'string', maxLength: 10000 },
    theme:    { type: 'string' },
    config:   configSchema,
    format:   { type: 'string', enum: ['png', 'jpeg', 'webp'] },
    scale:    { type: 'number', enum: [1, 2, 3] },
    quality:  { type: 'number', minimum: 0.01, maximum: 1 },
  },
};

export const validateRender = ajv.compile(renderSchema);
