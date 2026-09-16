'use client';

import {
  Anchor,
  Badge,
  Button,
  Code,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
} from '@mantine/core';

import { IconExternalLink } from '@tabler/icons-react';

export default function ResourceModal({
  resource,
  opened,
  onClose,
}) {
  if (!resource) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={resource.title}
      centered
      size="lg"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 2,
      }}
    >
      <Stack gap="lg">

        {/* Description */}
        <div>
          <Text
            size="sm"
            fw={600}
            mb={5}
          >
            About
          </Text>

          <Text
            c="dimmed"
            size="sm"
            lh={1.6}
          >
            {resource.description}
          </Text>
        </div>

        <Divider />

        {/* Category + Pricing */}
        <Group>
          <Badge
            variant="light"
            color="violet"
          >
            {resource.category}
          </Badge>

          <Badge
            variant="outline"
            color="gray"
          >
            {resource.pricing}
          </Badge>
        </Group>

        {/* Installation */}
        <div>
          <Text
            size="sm"
            fw={600}
            mb={6}
          >
            Installation
          </Text>

          <Code
            block
            style={{
              padding: '12px',
            }}
          >
            {resource.install}
          </Code>
        </div>

        {/* Related Tools */}
        <div>
          <Text
            size="sm"
            fw={600}
            mb={8}
          >
            Related Tools
          </Text>

          <Group gap="xs">
            {resource.related.map((tool) => (
              <Badge
                key={tool}
                variant="light"
                color="violet"
              >
                {tool}
              </Badge>
            ))}
          </Group>
        </div>

        <Divider />

        {/* Links */}
        <Group>
          <Button
            component="a"
            href={resource.docs}
            target="_blank"
            rel="noopener noreferrer"
            color="violet"
            rightSection={
              <IconExternalLink size={16} />
            }
          >
            Official Docs
          </Button>

          <Anchor
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
          >
            Visit Website
          </Anchor>
        </Group>

      </Stack>
    </Modal>
  );
}