import { BaseNode } from './BaseNode';
import { DatabaseNode } from './DatabaseNode';
import { ApiNode } from './ApiNode';
import { FunctionNode } from './FunctionNode';
import { ParallelNode } from './flow/ParallelNode';
import { TriggerNode } from './triggers/TriggerNode';
import { TransformNode } from './data/TransformNode';
import { FilterNode } from './data/FilterNode';
import { MergeNode } from './data/MergeNode';
import { SwitchNode } from './flow/SwitchNode';
import { LoopNode } from './flow/LoopNode';
import { PostgresNode } from './database/postgres/PostgresNode';
import { PostgresNodeDefinition } from './database/postgres/types';
import { SendGridNodeDefinition } from './integrations/sendgrid/types';
import { SnowflakeNode } from './integrations/SnowflakeNode';

export const nodeTypes = {
  base: BaseNode,
  database: DatabaseNode,
  api: ApiNode,
  function: FunctionNode,
  parallel: ParallelNode,
  trigger: TriggerNode,
  transform: TransformNode,
  filter: FilterNode,
  merge: MergeNode,
  switch: SwitchNode,
  loop: LoopNode,
  postgres: PostgresNode,
  sendgrid: SendGridNodeDefinition.component,
  snowflake: SnowflakeNode,
};

export const nodeDefinitions = {
  sendgrid: SendGridNodeDefinition,
  postgres: PostgresNodeDefinition,
  // Add other node definitions here as needed
};

export * from './types';