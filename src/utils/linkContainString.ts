function linkContainsString(link: string, searchString: string) {
  // Convert both the link and the searchString to lowercase for case-insensitive comparison
  const lowercaseLink = link.toLowerCase();
  const lowercaseSearchString = searchString.toLowerCase();

  // Check if the link contains the searchString
  return lowercaseLink.includes(lowercaseSearchString);
}

export default linkContainsString;
