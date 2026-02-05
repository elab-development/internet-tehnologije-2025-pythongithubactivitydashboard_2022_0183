import { Link } from 'react-router-dom';
import {
  Github,
  BookOpen,
  FolderGit2,
  GitCommit,
  GitPullRequest,
  CircleDot,
  Activity,
  KeyRound,
  Search,
  Filter,
  Clock,
} from 'lucide-react';
import { useAuthStore } from '../store/auth.store';

import Card from '../components/home/Card';
import Step from '../components/home/Step';

export default function Home() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  return (
    <div className='space-y-8'>
      <section className='bg-white rounded-2xl shadow-lg overflow-hidden'>
        <div className='p-6 sm:p-8'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='h-11 w-11 rounded-2xl bg-gray-900 text-white flex items-center justify-center'>
              <Github className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-2xl sm:text-3xl font-semibold text-gray-900'>
                GitDash
              </h1>
              <p className='text-sm text-gray-600'>
                Open-source GitHub Activity Dashboard for public repositories
              </p>
            </div>
          </div>

          <p className='text-gray-700 leading-relaxed max-w-3xl'>
            GitDash helps you track activity across one or more GitHub
            repositories in a clean, chronological timeline. You can sync
            commits, issues, and pull requests through a Flask backend
            (PyGithub), store them in PostgreSQL, and explore them via a React
            dashboard with filtering and search.
          </p>

          <div className='mt-6 flex flex-col sm:flex-row gap-3'>
            {!isAuthenticated ? (
              <>
                <Link
                  to='/register'
                  className='inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-black transition'
                >
                  <BookOpen className='h-4 w-4' />
                  Get started
                </Link>
                <Link
                  to='/login'
                  className='inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-900 px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition'
                >
                  <Activity className='h-4 w-4' />
                  Sign in
                </Link>
              </>
            ) : (
              <>
                <Link
                  to='/profile'
                  className='inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-black transition'
                >
                  <Activity className='h-4 w-4' />
                  Go to Profile
                </Link>
                <div className='inline-flex items-center gap-2 rounded-xl bg-gray-100 text-gray-800 px-4 py-2.5 text-sm'>
                  <span className='h-2 w-2 rounded-full bg-green-500' />
                  Signed in as{' '}
                  <span className='font-medium'>{user?.username}</span>
                </div>
              </>
            )}
          </div>

          <div className='mt-6 flex flex-wrap gap-2'>
            <span className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs'>
              <Filter className='h-3.5 w-3.5' /> Filter by type
            </span>
            <span className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs'>
              <Search className='h-3.5 w-3.5' /> Search by author / text
            </span>
            <span className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs'>
              <Clock className='h-3.5 w-3.5' /> Chronological timeline
            </span>
          </div>
        </div>
      </section>

      <section className='space-y-4'>
        <div className='flex items-center gap-2'>
          <BookOpen className='h-5 w-5 text-gray-700' />
          <h2 className='text-lg font-semibold text-gray-900'>
            GitHub concepts (quick guide)
          </h2>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          <Card icon={<Github className='h-5 w-5' />} title='What is GitHub?'>
            GitHub is a platform for hosting Git repositories and collaborating
            on software projects. It provides tools for code review, issues,
            pull requests, and automation.
          </Card>

          <Card icon={<FolderGit2 className='h-5 w-5' />} title='Repository'>
            A repository (repo) is a project space that contains source code,
            history (commits), branches, and collaboration features like issues
            and pull requests.
          </Card>

          <Card icon={<GitCommit className='h-5 w-5' />} title='Commit'>
            A commit is a snapshot of changes. It includes a message, author,
            timestamp, and diffs. In GitDash, commits help you see what changed
            and when.
          </Card>

          <Card
            icon={<GitPullRequest className='h-5 w-5' />}
            title='Pull request'
          >
            A pull request (PR) proposes changes from one branch to another. It
            supports review, discussion, and merging. GitDash tracks PR state
            and merge info.
          </Card>

          <Card icon={<CircleDot className='h-5 w-5' />} title='Issue'>
            Issues are used to report bugs, request features, or track tasks.
            They can be open or closed and often link to commits and pull
            requests.
          </Card>

          <Card
            icon={<Activity className='h-5 w-5' />}
            title='Activity timeline'
          >
            GitDash aggregates repo events into a single timeline so you can
            understand project movement at a glance and filter what matters.
          </Card>
        </div>
      </section>

      <section className='space-y-4'>
        <div className='flex items-center gap-2'>
          <Activity className='h-5 w-5 text-gray-700' />
          <h2 className='text-lg font-semibold text-gray-900'>
            How GitDash works
          </h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Step
            icon={<KeyRound className='h-4 w-4' />}
            title='1) Add GitHub token (optional)'
          >
            You can save a GitHub token to increase API rate limits and ensure
            stable access to repository data. The frontend never talks directly
            to GitHub.
          </Step>

          <Step
            icon={<FolderGit2 className='h-4 w-4' />}
            title='2) Pick repos to track'
          >
            Fetch your repositories from GitHub, then add chosen repos to your
            GitDash dashboard. They are stored in PostgreSQL under your account.
          </Step>

          <Step
            icon={<Activity className='h-4 w-4' />}
            title='3) Sync + explore activity'
          >
            GitDash syncs commits, issues, and pull requests into the database.
            You can then browse, filter by type, search by author/text, and
            follow activity chronologically.
          </Step>
        </div>
      </section>

      <section className='bg-gray-900 text-white rounded-2xl shadow-lg overflow-hidden'>
        <div className='p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <div>
            <h3 className='text-lg font-semibold'>
              Ready to track your repositories?
            </h3>
            <p className='text-sm text-gray-200 mt-1'>
              Create an account, add repos, and start syncing activity into your
              dashboard.
            </p>
          </div>

          {!isAuthenticated ? (
            <Link
              to='/register'
              className='inline-flex items-center justify-center gap-2 rounded-xl bg-white text-gray-900 px-4 py-2.5 text-sm font-medium hover:bg-gray-100 transition'
            >
              <BookOpen className='h-4 w-4' />
              Create account
            </Link>
          ) : (
            <Link
              to='/profile'
              className='inline-flex items-center justify-center gap-2 rounded-xl bg-white text-gray-900 px-4 py-2.5 text-sm font-medium hover:bg-gray-100 transition'
            >
              <Activity className='h-4 w-4' />
              Open Profile
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
