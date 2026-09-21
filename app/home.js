'use client';

import { useEffect, useState } from 'react';
import { useLocalStorage } from '@mantine/hooks';

import {
  Badge,
  Container,
  Group,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core';

import { IconBookmark, IconSearch } from '@tabler/icons-react';

import { useRouter, useSearchParams } from 'next/navigation';

import { resources } from '../data/resources';
import ResourceCard from '../components/ResourceCard';
import ResourceModal from '../components/ResourceModal';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const validCategories = [
    'All',
    'UI Libraries',
    'Backend / APIs',
    'Icons & Assets',
    'AI Tools',
  ];

  const [search, setSearch] = useState(
    searchParams.get('search') || ''
  );

  const [category, setCategory] = useState(() => {
    const urlCategory = searchParams.get('category');

    return validCategories.includes(urlCategory)
      ? urlCategory
      : 'All';
  });

  const [savedOnly, setSavedOnly] = useState(false);

  const [savedResources, setSavedResources] = useLocalStorage({
    key: 'devlink-bookmarks',
    defaultValue: [],
    getInitialValueInEffect: true,
    deserialize: (value) => {
      try {
        const parsed = JSON.parse(value);

        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    },
  });

  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) {
      params.set('search', search);
    }

    if (category !== 'All') {
      params.set('category', category);
    }

    const queryString = params.toString();

    router.replace(
      queryString ? `/?${queryString}` : '/'
    );
  }, [search, category, router]);

  const toggleBookmark = (resourceId) => {
    setSavedResources((currentSaved) => {
      if (currentSaved.includes(resourceId)) {
        return currentSaved.filter(
          (id) => id !== resourceId
        );
      }

      return [...currentSaved, resourceId];
    });
  };

  const filteredResources = resources.filter((resource) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      resource.title
        .toLowerCase()
        .includes(searchText) ||
      resource.description
        .toLowerCase()
        .includes(searchText) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchText)
      );

    const matchesCategory =
      category === 'All' ||
      resource.category === category;

    const matchesSaved =
      !savedOnly ||
      savedResources.includes(resource.id);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSaved
    );
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
      }}
    >
      <Container size="xl" py="xl">
        <Stack gap="xl">

          {/* Header */}
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={1}>DevLink</Title>

              <Text c="dimmed" mt={5}>
                Discover useful resources for developers.
              </Text>
            </div>

            <Badge
              size="lg"
              leftSection={<IconBookmark size={16} />}
              color="violet"
              variant="light"
            >
              {savedResources.length} Saved
            </Badge>
          </Group>

          {/* Search and Saved Filter */}
          <Paper p="md" withBorder radius="md">
            <Stack gap="md">
              <TextInput
                placeholder="Search resources..."
                leftSection={<IconSearch size={18} />}
                value={search}
                onChange={(event) =>
                  setSearch(event.currentTarget.value)
                }
              />

              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  Show saved only
                </Text>

                <Switch
                  checked={savedOnly}
                  onChange={(event) =>
                    setSavedOnly(
                      event.currentTarget.checked
                    )
                  }
                  color="violet"
                />
              </Group>
            </Stack>
          </Paper>

          {/* Categories */}
          <Paper p="md" withBorder radius="md">
            <Stack gap="xs">
              <Text size="sm" fw={500}>
                Category
              </Text>

              <SegmentedControl
                fullWidth
                value={category}
                onChange={setCategory}
                data={validCategories}
                color="violet"
              />
            </Stack>
          </Paper>

          {/* Results */}
          <Group justify="space-between">
            <Text fw={500}>
              {filteredResources.length} resource
              {filteredResources.length !== 1 ? 's' : ''}
            </Text>

            {search && (
              <Text size="sm" c="dimmed">
              Searching for &quot;{search}&quot;
              </Text>
            )}
          </Group>

          {/* Resource Cards */}
          {filteredResources.length > 0 ? (
            <SimpleGrid
              cols={{
                base: 1,
                sm: 2,
                lg: 3,
              }}
              spacing="lg"
            >
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  isSaved={savedResources.includes(
                    resource.id
                  )}
                  onToggleBookmark={toggleBookmark}
                  onOpenModal={setSelectedResource}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Paper
              p="xl"
              withBorder
              radius="md"
              ta="center"
            >
              <Stack align="center" gap="xs">
                <IconSearch size={32} />

                <Title order={3}>
                  No resources found
                </Title>

                <Text c="dimmed">
                  Try changing your search or category.
                </Text>
              </Stack>
            </Paper>
          )}

        </Stack>
      </Container>

      <ResourceModal
        resource={selectedResource}
        opened={selectedResource !== null}
        onClose={() => setSelectedResource(null)}
      />
    </div>
  );
} 