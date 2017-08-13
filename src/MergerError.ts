import * as jsonPtr from "json-ptr";
import Context from "./Context";

export default class MergerError extends Error {

    constructor(originalError: Error, context: Context) {
        super();

        // Set the prototype explicitly because because new.target
        // is not available in ES5 runtime environments.
        (this as any).__proto__ = MergerError.prototype;

        const message = this._createMessage(context);
        const stack = this._createProcessingStackTrace(context);
        this.name = "MergerError";
        this.message = `${message}${stack}\n${originalError.message}`;
        this.stack = `${message}${stack}\n${originalError.stack}`;
    }

    private _createMessage(context: Context) {
        let message = "";
        if (context.currentSource) {
            const lastProp = context.currentSource.path[context.currentSource.path.length - 1];
            message = `An error occurred while processing the property "${lastProp}"\n`;
        }
        return message;
    }

    private _createProcessingStackTrace(context: Context) {
        return context.sourceStack.reverse().reduce((trace, source) => {
            const pathEncoded = jsonPtr.encodePointer(source.path);
            const file = source.filePath === undefined ? "" : source.filePath;
            return `${trace}    at ${file}#${pathEncoded}\n`;
        }, "");
    }
}