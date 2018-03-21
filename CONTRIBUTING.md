# Contributing
**First of all, thank you for contibuting!**
## Code style
We follow the [standard code style](https://standardjs.com). The most basic rules are:
* Indent with 2 spaces
* Single quotes (unless to avoid escaping)
* No semi-colons, unless you are starting a line with `(`, `[`, or a backtick (in that case start that line with a semi-colon)
* No unused variables
* Space after keywords and function names
* Use `===`, but you are allowed to do `obj == null` for `null` or `undefined`

If you use ESLint, StandardJS is already implemented into this project's `.eslintrc.js`

## Submitting changes
For small commits, one-liners are OK. For bigger commits, add an extended description. This is easily done on GitHub, on some GUIs you just have to hit newline. For CLI users, do this:
```bash
$ git commit -m "Short description
> 
> Short paragraph explaining the commit"
```
