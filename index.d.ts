declare namespace linna  {
     /**
     * The context of the current execution; used to observe and pass on cancellation signals.
     */
      export type Context = {
        env: {[key: string]: string},
        executionMode: string,
        node: string,
        headers: {[key: string]: string[]},
        queryParams: {[key: string]: string[]},
        userId: string,
        username: string,
        vars: {[key: string]: string}
        userSessionExp: number,
        sessionId: string,
        clientIp: string,
        clientPort: string,
        lang: string,
    }

    type ReadPermissionValues = 0 | 1 | 2;
    type WritePermissionValues = 0 | 1;

     /**
     * GRPC Error codes supported for thrown custom errors.
     *
     * These errors map to HTTP status codes as shown here: https://github.com/grpc/grpc/blob/master/doc/http-grpc-status-mapping.md/.
     */
      const enum Codes {
        CANCELLED = 1, // The operation was cancelled, typically by the caller.
        UNKNOWN = 2, // Unknown error. For example, this error may be returned when a Status value received from another address space belongs to an error space that is not known in this address space. Also errors raised by APIs that do not return enough error information may be converted to this error.
        INVALID_ARGUMENT = 3, // The client specified an invalid argument. Note that this differs from FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are problematic regardless of the state of the system (e.g., a malformed file name).
        DEADLINE_EXCEEDED = 4, // The deadline expired before the operation could complete. For operations that change the state of the system, this error may be returned even if the operation has completed successfully. For example, a successful response from a server could have been delayed long
        NOT_FOUND = 5, // Some requested entity (e.g., file or directory) was not found. Note to server developers: if a request is denied for an entire class of users, such as gradual feature rollout or undocumented allowlist, NOT_FOUND may be used. If a request is denied for some users within a class of users, such as user-based access control, PERMISSION_DENIED must be used.
        ALREADY_EXISTS = 6, // The entity that a client attempted to create (e.g., file or directory) already exists.
        PERMISSION_DENIED = 7, // The caller does not have permission to execute the specified operation. PERMISSION_DENIED must not be used for rejections caused by exhausting some resource (use RESOURCE_EXHAUSTED instead for those errors). PERMISSION_DENIED must not be used if the caller can not be identified (use UNAUTHENTICATED instead for those errors). This error code does not imply the request is valid or the requested entity exists or satisfies other pre-conditions.
        RESOURCE_EXHAUSTED = 8, // Some resource has been exhausted, perhaps a per-user quota, or perhaps the entire file system is out of space.
        FAILED_PRECONDITION = 9, // The operation was rejected because the system is not in a state required for the operation's execution. For example, the directory to be deleted is non-empty, an rmdir operation is applied to a non-directory, etc. Service implementors can use the following guidelines to decide between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE: (a) Use UNAVAILABLE if the client can retry just the failing call. (b) Use ABORTED if the client should retry at a higher level (e.g., when a client-specified test-and-set fails, indicating the client should restart a read-modify-write sequence). (c) Use FAILED_PRECONDITION if the client should not retry until the system state has been explicitly fixed. E.g., if an "rmdir" fails because the directory is non-empty, FAILED_PRECONDITION should be returned since the client should not retry unless the files are deleted from the directory.
        ABORTED = 10, // The operation was aborted, typically due to a concurrency issue such as a sequencer check failure or transaction abort. See the guidelines above for deciding between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE.
        OUT_OF_RANGE = 11, // The operation was attempted past the valid range. E.g., seeking or reading past end-of-file. Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed if the system state changes. For example, a 32-bit file system will generate INVALID_ARGUMENT if asked to read at an offset that is not in the range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from an offset past the current file size. There is a fair bit of overlap between FAILED_PRECONDITION and OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error) when it applies so that callers who are iterating through a space can easily look for an OUT_OF_RANGE error to detect when they are done.
        UNIMPLEMENTED = 12, // The operation is not implemented or is not supported/enabled in this service.
        INTERNAL = 13, // Internal errors. This means that some invariants expected by the underlying system have been broken. This error code is reserved for serious errors.
        UNAVAILABLE = 14, // The service is currently unavailable. This is most likely a transient condition, which can be corrected by retrying with a backoff. Note that it is not always safe to retry non-idempotent operations.
        DATA_LOSS = 15, // Unrecoverable data loss or corruption.
        UNAUTHENTICATED = 16, // The request does not have valid authentication credentials for the operation.
    }

     /**
     * A custom Runtime Error
     */
      export type Error = {
        message: string
        code: Codes
    }

     /**
     * An RPC function definition.
     */
      export interface RpcFunction {
        /**
         * An RPC function to be executed when called by ID.
         *
         * @param ctx - The context for the execution.
         * @param logger - The server logger.
         * @param nk - The Nakama server APIs.
         * @param payload - The input data to the function call. This is usually an escaped JSON object.
         * @throws {TypeError}
         * @returns A response payload or error if one occurred.
         */
        (ctx: Context, logger: Logger, linna: Module, payload: string): string | void;
    }

    /**
     * The server APIs available in the game server.
     */
     export interface Module {
        /**
         * Convert binary data to string.
         *
         * @param data - Data to convert to string.
         * @throws {TypeError}
         */
         binaryToString(data: Uint8Array): string;

        /**
         * Convert a string to binary data.
         *
         * @param str - String to convert to binary data.
         * @throws {TypeError}
         */
         stringToBinary(str: string): Uint8Array;

        /**
         * Emit an event to be processed.
         *
         * @param eventName - A string with the event name.
         * @param properties - A map of properties to send in the event.
         * @param timestamp - (optional) Timestamp of the event as a Unix epoch.
         * @param external - (optional) External (client side) generated event.
         * @throws {TypeError}
         */
        event(eventName: string, properties: {[key: string]: string}, timestamp?: number, external?: boolean): void;

        /**
         * Add a custom metrics counter.
         *
         * @param name - The name of the custom metrics counter.
         * @param tags - The metrics tags associated with this counter.
         * @param delta - An integer value to update this metric with.
         * @throws {TypeError}
         */
        metricsCounterAdd(name: string, tags: {[key: string]: string}, delta: number): void;

        /**
         * Add a custom metrics gauge.
         *
         * @param name - The name of the custom metrics gauge.
         * @param tags - The metrics tags associated with this gauge.
         * @param value - A value to update this metric with.
         * @throws {TypeError}
         */
        metricsGaugeSet(name: string, tags: {[key: string]: string}, value: number): void;


        /**
         * Add a custom metrics timer.
         *
         * @param name - The name of the custom metrics timer.
         * @param tags - The metrics tags associated with this timer.
         * @param value - An integer value to update this metric with (in nanoseconds).
         * @throws {TypeError}
         */
        metricsTimerRecord(name: string, tags: {[key: string]: string}, value: number): void;

        /**
         * Generate a new UUID v4.
         *
         * @returns UUID v4
         *
         */
        uuidv4(): string

        /**
         * Execute an SQL query to the Nakama database.
         *
         * @param sqlQuery - SQL Query string.
         * @param arguments - Opt. List of arguments to map to the query placeholders.
         * @returns the number of affected rows.
         * @throws {TypeError, GoError}
         */
        sqlExec(sqlQuery: string, args?: any[]): SqlExecResult;

        /**
         * Get the results of an SQL query to the Nakama database.
         *
         * @param sqlQuery - SQL Query string.
         * @param arguments - List of arguments to map to the query placeholders.
         * @returns an array of the returned query rows, each one containing an object whose keys map a column to the row value.
         * @throws {TypeError, GoError}
         */
        sqlQuery(sqlQuery: string, args?: any[]): SqlQueryResult;

        /**
         * Http Request
         *
         * @param url - Request target URL.
         * @param method - Http method.
         * @param headers - Http request headers.
         * @param body - Http request body.
         * @param timeout - Http Request timeout in ms.
         * @returns Http response
         * @throws {TypeError, GoError}
         */
        httpRequest(url: string, method: RequestMethod, headers?: {[header: string]: string}, body?: string, timeout?: number): HttpResponse

        /**
         * Base 64 Encode
         *
         * @param string - Input to encode.
         * @returns Base 64 encoded string.
         *
         * @throws {TypeError}
         */
        base64Encode(s: string, padding?: boolean): string;

        /**
         * Base 64 Decode
         *
         * @param string - Input to decode.
         * @returns Decoded string.
         * @throws {TypeError, GoError}
         */
        base64Decode(s: string, padding?: boolean): string;

        /**
         * Base 64 URL Encode
         *
         * @param string - Input to encode.
         * @returns URL safe base 64 encoded string.
         * @throws {TypeError}
         */
        base64UrlEncode(s: string, padding?: boolean): string;

        /**
         * Base 64 URL Decode
         *
         * @param string - Input to decode.
         * @returns Decoded string.
         * @throws {TypeError, GoError}
         */
        base64UrlDecode(s: string, padding?: boolean): string;

        /**
         * Base 16 Encode
         *
         * @param string - Input to encode.
         * @returns URL safe base 64 encoded string.
         * @throws {TypeError}
         */
        base16Encode(s: string, padding?: boolean): string;

        /**
         * Base 16 Decode
         *
         * @param string - Input to decode.
         * @returns Decoded string.
         * @throws {TypeError, GoError}
         */
        base16Decode(s: string, padding?: boolean): string;

        /**
         * Generate a JWT token
         *
         * @param algorithm - JWT signing algorithm.
         * @param signingKey - Signing key.
         * @param claims - JWT claims.
         * @returns signed JWT token.
         * @throws {TypeError, GoError}
         */
        jwtGenerate(s: 'HS256' | 'RS256', signingKey: string, claims: {[key: string]: string | number | boolean}): string;

        /**
         * AES 128 bit block size encrypt
         *
         * @param input - String to encrypt.
         * @param key - Encryption key.
         * @returns cipher text base64 encoded.
         * @throws {TypeError, GoError}
         */
        aes128Encrypt(input: string, key: string): string;

        /**
         * AES 128 bit block size decrypt
         *
         * @param input - String to decrypt.
         * @param key - Encryption key.
         * @returns clear text.
         * @throws {TypeError, GoError}
         */
        aes128Decrypt(input: string, key: string): string;

        /**
         * AES 256 bit block size encrypt
         *
         * @param input - String to encrypt.
         * @param key - Encryption key.
         * @returns cipher text base64 encoded.
         * @throws {TypeError, GoError}
         */
        aes256Encrypt(input: string, key: string): string;

        /**
         * AES 256 bit block size decrypt
         *
         * @param input - String to decrypt.
         * @param key - Encryption key.
         * @returns clear text.
         * @throws {TypeError, GoError}
         */
        aes256Decrypt(input: string, key: string): string;

        /**
         * MD5 Hash of the input
         *
         * @param input - String to hash.
         * @returns md5 Hash.
         * @throws {TypeError}
         */
        md5Hash(input: string): string;

        /**
         * SHA256 Hash of the input
         *
         * @param input - String to hash.
         * @returns sha256 Hash.
         * @throws {TypeError}
         */
        sha256Hash(input: string): string;

        /**
         * RSA SHA256 Hash of the input
         *
         * @param input - String to hash.
         * @param key - RSA private key.
         * @returns sha256 Hash.
         * @throws {TypeError, GoError}
         */
        rsaSha256Hash(input: string, key: string): string;

        /**
         * HMAC SHA256 of the input
         *
         * @param input - String to hash.
         * @param key - secret key.
         * @returns HMAC SHA256.
         * @throws {TypeError, GoError}
         */
        hmacSha256Hash(input: string, key: string): string;

        /**
         * BCrypt hash of a password
         *
         * @param password - password to hash.
         * @returns password bcrypt hash.
         * @throws {TypeError, GoError}
         */
        bcryptHash(password: string): string;

        /**
         * Compare BCrypt password hash with password for a match.
         *
         * @param password - plaintext password.
         * @param hash - hashed password.
         * @returns true if hashed password and plaintext password match, false otherwise.
         * @throws {TypeError, GoError}
         */
        bcryptCompare(hash: string, password: string): boolean;
    }

    /**
     * Request method type
     */
     type RequestMethod = "get" | "post" | "put" | "patch" | "head"

     /**
      * HTTP Response type
      */
     export interface HttpResponse {
         /**
          * Http Response status code.
          */
         code: number;
         /**
          * Http Response headers.
          */
         headers: string[];
         /**
          * Http Response body.
          */
         body: string;
     }

    export interface SqlExecResult {
        rowsAffected: number
    }

    type SqlQueryResult = {[column: string]: any}[]

    /**
     * A structured logger to output messages to the game server.
     */
     export interface Logger {
        /**
         * Log a message with optional formatted arguments at INFO level.
         *
         * @param format - A string with optional formatting placeholders.
         * @param args - The placeholder arguments for the formatted string.
         * @returns The formatted string logged to the server.
         */
        info(format: string, ...args: any[]): string;

        /**
         * Log a message with optional formatted arguments at WARN level.
         *
         * @param format - A string with optional formatting placeholders.
         * @param args - The placeholder arguments for the formatted string.
         * @returns The formatted string logged to the server.
         */
        warn(format: string, ...args: any[]): string;

        /**
         * Log a message with optional formatted arguments at ERROR level.
         *
         * @param format - A string with optional formatting placeholders.
         * @param args - The placeholder arguments for the formatted string.
         * @returns The formatted string logged to the server.
         */
        error(format: string, ...args: any[]): string;

        /**
         * Log a message with optional formatted arguments at DEBUG level.
         *
         * @param format - A string with optional formatting placeholders.
         * @param args - The placeholder arguments for the formatted string.
         * @returns The formatted string logged to the server.
         */
        debug(format: string, ...args: any[]): string;

        /**
         * A logger with the key/value pair added as the fields logged alongside the message.
         *
         * @param key - The key name for the field.
         * @param value - The value for the field.
         * @returns The modified logger with the new structured fields.
         */
        withField(key: string, value: string): Logger;

        /**
         * A new logger with the key/value pairs added as fields logged alongside the message.
         *
         * @param pairs - The pairs of key/value fields to add.
         * @returns The modified logger with the new structured fields.
         */
        withFields(pairs: {[key: string]: string}): Logger;

        /**
         * The fields associated with this logger.
         *
         * @returns The map of fields in the logger.
         */
        getFields(): {[key: string]: string};
    }

     /**
     * The injector used to initialize features of the game server.
     */
    export interface Initializer {
        /**
         * Register an RPC function by its ID to be called as a S2S function or by game clients.
         *
         * @param id - The ID of the function in the server.
         * @param func - The RPC function logic to execute when the RPC is called.
         */
        registerRpc(id: string, func: RpcFunction): void;
    }

    /**
     * The start function for Nakama to initialize the server logic.
     */
     export interface InitModule {
        /**
         * Executed at server startup.
         *
         * @remarks
         * This function executed will block the start up sequence of the game server. You must use
         * care to limit the compute time of logic run in this function.
         *
         * @param ctx - The context of the execution.
         * @param logger - The server logger.
         * @param nk - The Nakama server APIs.
         * @param initializer - The injector to initialize features in the game server.
         */
        (ctx: Context, logger: Logger, Linna: Module, initializer: Initializer): void;
    }
}