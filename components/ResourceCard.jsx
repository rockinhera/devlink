'use client';

import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import {
  IconBookmark,
  IconBookmarkFilled,
  IconExternalLink,
} from '@tabler/icons-react';

export default function ResourceCard({
  resource,
  isSaved,
  onToggleBookmark,
  onOpenModal,
}) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        height: '100%',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform =
          'translateY(-3px)';
        event.currentTarget.style.boxShadow =
          '0 8px 20px rgba(0, 0, 0, 0.08)';
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform =
          'translateY(0)';
        event.currentTarget.style.boxShadow =
          '';
      }}
    >
      <Stack
        gap="md"
        justify="space-between"
        style={{ height: '100%' }}
      >

        {/* Category + Bookmark */}
        <Group
          justify="space-between"
          align="flex-start"
        >
          <Badge
            variant="light"
            color="violet"
          >
            {resource.category}
          </Badge>

          <ActionIcon
            variant={isSaved ? 'filled' : 'subtle'}
            color="violet"
            onClick={() =>
              onToggleBookmark(resource.id)
            }
            aria-label={
              isSaved
                ? `Remove ${resource.title} from bookmarks`
                : `Save ${resource.title}`
            }
          >
            {isSaved ? (
              <IconBookmarkFilled size={18} />
            ) : (
              <IconBookmark size={18} />
            )}
          </ActionIcon>
        </Group>

        {/* Title + Description */}
        <div>
          <Title
            order={3}
            size="h4"
            mb="xs"
          >
            {resource.title}
          </Title>

          <Text
            c="dimmed"
            size="sm"
            lh={1.6}
          >
            {resource.description}
          </Text>
        </div>

        {/* Tags */}
        <Group gap="xs">
          {resource.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              color="gray"
              size="sm"
            >
              {tag}
            </Badge>
          ))}
        </Group>

        {/* Buttons */}
        <Group
          mt="auto"
          pt="xs"
        >
          <Button
            variant="light"
            color="violet"
            onClick={() =>
              onOpenModal(resource)
            }
          >
            Quick View
          </Button>

          <Button
            component="a"
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="subtle"
            color="violet"
            rightSection={
              <IconExternalLink size={16} />
            }
          >
            Visit
          </Button>
        </Group>

      </Stack>
    </Card>
  );
} 