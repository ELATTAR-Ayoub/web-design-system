"use client";

import { SchemaDisplay } from "@/components/ai-elements/schema-display";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

/** Live specimens for the `ai-schema-display` documentation page. */

const PARAMETERS = [
  { description: "The order to update", location: "path" as const, name: "orderId", required: true, type: "string" },
  { description: "Send the customer an email", location: "query" as const, name: "notify", type: "boolean" },
];

const REQUEST_BODY = [
  { name: "status", required: true, type: "string", description: "pending, shipped or cancelled" },
  {
    name: "address",
    type: "object",
    properties: [
      { name: "city", required: true, type: "string" },
      { name: "postcode", type: "string" },
    ],
  },
  { name: "tags", type: "array", items: { name: "tag", type: "string" } },
];

const RESPONSE_BODY = [
  { name: "id", required: true, type: "string" },
  { name: "updatedAt", type: "string", description: "ISO 8601 timestamp" },
];

/** The Preview: a full endpoint with parameters, a nested request body and a response. */
export function SchemaDisplayPreview() {
  return (
    <Panel flush label="SchemaDisplay" note="PATCH with parameters, nested body, response">
      <SchemaDisplay
        className="rounded-none border-0"
        description="Update the status or address of an order."
        method="PATCH"
        parameters={PARAMETERS}
        path="/orders/{orderId}"
        requestBody={REQUEST_BODY}
        responseBody={RESPONSE_BODY}
      />
    </Panel>
  );
}

/** The States grid: the five methods and the badge variant each one takes. */
export function SchemaDisplayStateGrid() {
  return (
    <StateGrid cols={3}>
      <StateCell label="GET" note="success">
        <SchemaDisplay className="w-full" method="GET" path="/orders/{orderId}" />
      </StateCell>
      <StateCell label="POST" note="info">
        <SchemaDisplay className="w-full" method="POST" path="/orders" />
      </StateCell>
      <StateCell label="PUT" note="warning">
        <SchemaDisplay className="w-full" method="PUT" path="/orders/{orderId}" />
      </StateCell>
      <StateCell label="PATCH" note="warning, same as PUT">
        <SchemaDisplay className="w-full" method="PATCH" path="/orders/{orderId}" />
      </StateCell>
      <StateCell label="DELETE" note="destructive">
        <SchemaDisplay className="w-full" method="DELETE" path="/orders/{orderId}" />
      </StateCell>
      <StateCell label="empty" note="no parameters or bodies: header only">
        <SchemaDisplay className="w-full" description="Health check." method="GET" path="/health" />
      </StateCell>
    </StateGrid>
  );
}
