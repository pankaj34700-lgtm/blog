// @vitest-environment node
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

describe('architecture guard', () => {
  it('TC-140 blocks direct imports of the dummy data module from components', async () => {
    const eslint = new ESLint();

    const [bad] = await eslint.lintText(
      "import { dummyBlogs } from '@/data/blogs';\nexport const total = dummyBlogs.length;\n",
      { filePath: 'src/components/lint-probe.tsx' },
    );

    expect(bad.messages.some((message) => message.ruleId === 'no-restricted-imports')).toBe(true);

    const [good] = await eslint.lintText(
      "import { listLatestBlogs } from '@/data/blogRepository';\nexport const load = listLatestBlogs;\n",
      { filePath: 'src/components/lint-probe-ok.tsx' },
    );

    expect(good.messages).toEqual([]);
  });

  it('TC-217 blocks direct imports of firebase/auth from components', async () => {
    const eslint = new ESLint();

    const [bad] = await eslint.lintText(
      "import { getAuth } from 'firebase/auth';\nexport const auth = getAuth;\n",
      { filePath: 'src/components/auth-probe.tsx' },
    );

    expect(bad.messages.some((message) => message.ruleId === 'no-restricted-imports')).toBe(true);

    const [good] = await eslint.lintText(
      "import { useAuth } from '@/auth/useAuth';\nexport const who = useAuth;\n",
      { filePath: 'src/components/auth-probe-ok.tsx' },
    );

    expect(good.messages).toEqual([]);
  });
});
