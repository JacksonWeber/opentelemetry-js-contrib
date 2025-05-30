# AWS X-Ray Remote Sampler

> This component is still in development and has not been released as an npm package.

[component owners](https://github.com/open-telemetry/opentelemetry-js-contrib/blob/main/.github/component_owners.yml): @jj22ee, @yiyuan-he

This module provides the remote/centralized sampler for AWS X-Ray.

## Usage

```js

const { AWSXRayRemoteSampler } = require('@opentelemetry/sampler-aws-xray');
const opentelemetry = require("@opentelemetry/sdk-node");
const { Resource } = require("@opentelemetry/resources");
const { BatchSpanProcessor} = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { AWSXRayPropagator } = require("@opentelemetry/propagator-aws-xray");
const { AWSXRayIdGenerator } = require("@opentelemetry/id-generator-aws-xray");


// Initialize trace exporter, span processor, and ID generator
const _traceExporter = new OTLPTraceExporter();
const _spanProcessor = new BatchSpanProcessor(_traceExporter);
const _tracerConfig = {
    // add x-ray remote sampler
    sampler: new AWSXRayRemoteSampler(),
    idGenerator: new AWSXRayIdGenerator(),
}

const sdk = new opentelemetry.NodeSDK({
    serviceName: "remote-sampler-app",
    textMapPropagator: new AWSXRayPropagator(),
    instrumentations: [
        new HttpInstrumentation(),
        new AwsInstrumentation({
            suppressInternalInstrumentation: true
        }),
    ],
    spanProcessor: _spanProcessor,
    traceExporter: _traceExporter,
});

sdk.configureTracerProvider(_tracerConfig, _spanProcessor);

```

For more details on setting up the global tracer provider to send traces to AWS X-Ray, refer to [this documentation](https://aws-otel.github.io/docs/getting-started/js-sdk/trace-manual-instr#setting-up-the-global-tracer).

Please note that AWS Lambda does not support X-Ray remote sampling.

## Semantic Conventions

This package does not currently generate any attributes from semantic conventions.

## Useful links

- [More information on OpenTelemetry](https://opentelemetry.io/)
- [More about OpenTelemetry JavaScript](https://github.com/open-telemetry/opentelemetry-js)
- [More in-depth documentation on setting up OpenTelemetry to send traces to AWS X-Ray](https://aws-otel.github.io/docs/getting-started/javascript-sdk)

## License

Apache 2.0 - See [LICENSE](https://github.com/open-telemetry/opentelemetry-js-contrib/blob/main/LICENSE) for more information.
