/**
 * Minimum window width value.
 *
 * @see http://dicom.nema.org/dicom/2013/output/chtml/part03/sect_C.11.html#sect_C.11.2.1.2
 */
const minWindowWidth = 1;

/**
 * List of default window level presets.
 *
 * @type {Object.<string, Object.<string, {center: number, width: number}>>}
 */
export const defaultPresets = {
  CT: {
    mediastinum: {center: 40, width: 400},
    lung: {center: -500, width: 1500}
  }
};

/**
 * Validate an input window width.
 *
 * @param {number} value The value to test.
 * @returns {number} A valid window width.
 */
export function validateWindowWidth(value) {
  return value < minWindowWidth ? minWindowWidth : value;
}

/**
 * WindowCenterAndWidth class.
 * <br>Pseudo-code:
 * <pre>
 *  if (x &lt;= c - 0.5 - (w-1)/2), then y = ymin
 *  else if (x > c - 0.5 + (w-1)/2), then y = ymax,
 *  else y = ((x - (c - 0.5)) / (w-1) + 0.5) * (ymax - ymin) + ymin
 * </pre>
 *
 * @see DICOM doc for [Window Center and Window Width]{@link http://dicom.nema.org/dicom/2013/output/chtml/part03/sect_C.11.html#sect_C.11.2.1.2}
 */
export class WindowCenterAndWidth {

  /**
   * The center.
   *
   * @type {number}
   */
  #center;

  /**
   * The width.
   *
   * @type {number}
   */
  #width;

  /**
   * @param {number} center The window center.
   * @param {number} width The window width.
   */
  constructor(center, width) {
    // check width
    if (width < minWindowWidth) {
      throw new Error('Window width shall always be greater than or equal to ' +
        minWindowWidth);
    }
    this.#center = center;
    this.#width = width;

    this.#init();
  }

  /**
   * Signed data offset. Defaults to 0.
   *
   * @type {number}
   */
  #signedOffset = 0;

  /**
   * Output value minimum. Defaults to 0.
   *
   * @type {number}
   */
  #ymin = 0;

  /**
   * Output value maximum. Defaults to 255.
   *
   * @type {number}
   */
  #ymax = 255;

  /**
   * Input value minimum (calculated).
   *
   * @type {number}
   */
  #xmin = null;

  /**
   * Input value maximum (calculated).
   *
   * @type {number}
   */
  #xmax = null;

  /**
   * Window level equation slope (calculated).
   *
   * @type {number}
   */
  #slope = null;

  /**
   * Window level equation intercept (calculated).
   *
   * @type {number}
   */
  #inter = null;

  /**
   * Initialise members. Called at construction.
   *
   */
  #init() {
    const c = this.#center + this.#signedOffset;
    // from the standard
    this.#xmin = c - 0.5 - ((this.#width - 1) / 2);
    this.#xmax = c - 0.5 + ((this.#width - 1) / 2);
    // develop the equation:
    // y = ( ( x - (c - 0.5) ) / (w-1) + 0.5 ) * (ymax - ymin) + ymin
    // y = ( x / (w-1) ) * (ymax - ymin) +
    //     ( -(c - 0.5) / (w-1) + 0.5 ) * (ymax - ymin) + ymin
    this.#slope = (this.#ymax - this.#ymin) / (this.#width - 1);
    this.#inter = (-(c - 0.5) / (this.#width - 1) + 0.5) *
      (this.#ymax - this.#ymin) + this.#ymin;
  }

  /**
   * Get the window center.
   *
   * @returns {number} The window center.
   */
  getCenter() {
    return this.#center;
  }

  /**
   * Get the window width.
   *
   * @returns {number} The window width.
   */
  getWidth() {
    return this.#width;
  }

  /**
   * Set the signed offset.
   *
   * @param {number} offset The signed data offset,
   *   typically: slope * ( size / 2).
   */
  setSignedOffset(offset) {
    this.#signedOffset = offset;
    // re-initialise
    this.#init();
  }

  /**
   * Apply the window level on an input value.
   *
   * @param {number} value The value to rescale as an integer.
   * @returns {number} The leveled value, in the
   *  [ymin, ymax] range (default [0,255]).
   */
  apply(value) {
    if (value <= this.#xmin) {
      return this.#ymin;
    } else if (value > this.#xmax) {
      return this.#ymax;
    } else {
      return (value * this.#slope) + this.#inter;
    }
  }

  /**
   * Check for window level equality.
   *
   * @param {WindowCenterAndWidth} rhs The other window level to compare to.
   * @returns {boolean} True if both window level are equal.
   */
  equals(rhs) {
    return rhs !== null &&
      typeof rhs !== 'undefined' &&
      this.getCenter() === rhs.getCenter() &&
      this.getWidth() === rhs.getWidth();
  }

} // class Contraste
