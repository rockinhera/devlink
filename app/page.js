'use client';

import { useEffect, useState } from 'react';

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

  const [search, setSearch] = useState(
    searchParams.get('search') || ''
  );

  const [category, setCategory] = useState(
    searchParams.get('category') || 'All'
  );

  const [savedOnly, setSavedOnly] = useState(false);

  const [savedResources, setSavedResources] = useState([]);

  const [bookmarksLoaded, setBookmarksLoaded] = useState(false);

  const [selectedResource, setSelectedResource] = useState(null);

  const categories = [
    'All',
    'UI Libraries',
    'Backend / APIs',
    'Icons & Assets',
    'AI Tools',
  ];

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('devlink-bookmarks');

    if (saved) {
      setSavedResources(JSON.parse(saved));
    }

    setBookmarksLoaded(true);
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    if (!bookmarksLoaded) return;

    localStorage.setItem(
      'devlink-bookmarks',
      JSON.stringify(savedResources)
    );
  }, [savedResources, bookmarksLoaded]);

  // Keep search and category in the URL
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

  // Add or remove bookmarks
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

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      resource.description
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(search.toLowerCase())
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
      <Container size="lg" py={50}>
        <Stack gap="xl">

          {/* Header */}
          <div>
            <Group
              justify="space-between"
              align="flex-start"
            >
              <div>
                <Text
                  size="sm"
                  fw={700}
                  c="violet"
                  style={{
                    letterSpacing: '0.08em',
                  }}
                >
                  DEVELOPER RESOURCE HUB
                </Text>

                <Title
                  order={1}
                  mt={5}
                  size="42px"
                >
                  DevLink
                </Title>

                <Text
                  c="dimmed"
                  mt="xs"
                  maw={600}
                  size="md"
                >
                  Discover useful tools, libraries, APIs,
                  and resources for your next project.
                </Text>
              </div>

              <Badge
                leftSection={
                  <IconBookmark size={14} />
                }
                variant="light"
                size="lg"
              >
                {savedResources.length} Saved
              </Badge>
            </Group>
          </div>

          {/* Search */}
          <Paper
            withBorder
            p="md"
            radius="md"
            shadow="xs"
          >
            <TextInput
              size="md"
              placeholder="Search by title, description, or tag..."
              leftSection={
                <IconSearch size={18} />
              }
              value={search}
              onChange={(event) =>
                setSearch(event.currentTarget.value)
              }
            />
          </Paper>

          {/* Filters */}
          <Group
            justify="space-between"
            align="center"
          >
            <SegmentedControl
              value={category}
              onChange={setCategory}
              data={categories}
            />

            <Switch
              label="Show saved only"
              checked={savedOnly}
              onChange={(event) =>
                setSavedOnly(
                  event.currentTarget.checked
                )
              }
            />
          </Group>

          {/* Resources */}
          <div>
            <Group
              justify="space-between"
              mb="md"
            >
              <div>
                <Title
                  order={2}
                  size="h3"
                >
                  Resources
                </Title>

                <Text
                  size="sm"
                  c="dimmed"
                  mt={4}
                >
                  Useful tools and resources for developers
                </Text>
              </div>

              <Text
                size="sm"
                c="dimmed"
              >
                {filteredResources.length} results
              </Text>
            </Group>

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
                withBorder
                p="xl"
                radius="md"
              >
                <Text
                  ta="center"
                  c="dimmed"
                >
                  No resources found.
                </Text>
              </Paper>
            )}
          </div>

          {/* Quick View Modal */}
          <ResourceModal
            resource={selectedResource}
            opened={selectedResource !== null}
            onClose={() =>
              setSelectedResource(null)
            }
          />

        </Stack>
      </Container>
    </div>
  );
} 