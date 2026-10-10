"use client";

import {
  PackageInfo,
  PackageInfoChangeType,
  PackageInfoContent,
  PackageInfoDependencies,
  PackageInfoDependency,
  PackageInfoDescription,
  PackageInfoHeader,
  PackageInfoName,
  PackageInfoVersion,
} from "@/components/ai-elements/package-info";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

export function PackageInfoPreview() {
  return (
    <Panel label="PackageInfo" note="header, version, description, dependencies">
      <PackageInfo changeType="minor" currentVersion="18.2.0" name="react-dom" newVersion="18.3.1">
        <PackageInfoHeader>
          <PackageInfoName />
          <PackageInfoChangeType />
        </PackageInfoHeader>
        <PackageInfoVersion />
        <PackageInfoDescription>React package for working with the DOM.</PackageInfoDescription>
        <PackageInfoContent>
          <PackageInfoDependencies>
            <PackageInfoDependency name="react" version="^18.3.1" />
            <PackageInfoDependency name="scheduler" version="^0.23.2" />
          </PackageInfoDependencies>
        </PackageInfoContent>
      </PackageInfo>
    </Panel>
  );
}

export function PackageInfoChangeTypes() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PackageInfo changeType="major" currentVersion="1.9.4" name="left-pad" newVersion="2.0.0" />
      <PackageInfo changeType="minor" currentVersion="4.1.0" name="zod" newVersion="4.2.0" />
      <PackageInfo changeType="patch" currentVersion="3.0.1" name="clsx" newVersion="3.0.2" />
      <PackageInfo changeType="added" name="vitest" newVersion="3.2.0" />
      <PackageInfo changeType="removed" currentVersion="2.4.0" name="moment" />
    </div>
  );
}

export function PackageInfoStateGrid() {
  return (
    <StateGrid cols={3}>
      <StateCell label="rest" note="name, change type and versions">
        <PackageInfo changeType="patch" className="w-full" currentVersion="1.0.0" name="clsx" newVersion="1.0.1" />
      </StateCell>
      <StateCell label="empty" note="name only: no badge, no version row">
        <PackageInfo className="w-full" name="clsx" />
      </StateCell>
      <StateCell label="no new version" note="current version alone, no arrow">
        <PackageInfo className="w-full" currentVersion="1.0.0" name="clsx" />
      </StateCell>
    </StateGrid>
  );
}
