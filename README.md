## Blackbeard.js GitBook plugin

This is a plugin used to write the Blackbeard.js documentation. It adds a few things to the original markdown syntax:


... a table of contents, automatically generated from the headlines in the document:
```
<!--- toc --->
```

... support badges:
```
<!-- support:<ios (0-4)>:<android (0-4)>:<windows (0-4)> -->
```

... stability level blocks:
```
<!-- stability:<0-4> -->
```

... stability level boxes:
```
<!-- stability-level:<0-4> -->
```

It also allows for easy referencing to headlines in the document (or standard JavaScript objects), without having to maintain a reference list at the bottom.
