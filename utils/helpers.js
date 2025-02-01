/**
 * Smoothly scroll to an element with the given id.
 * @param {string} id The id of the element to scroll to.
 */
export const scrollTo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}