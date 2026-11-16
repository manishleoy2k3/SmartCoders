import { NextRequest, NextResponse } from 'next/server';
import { UserExerciseProgressRecord, UserCodingProjectRecord } from '@/types/qa';

// In-Memory server store persisting during runtime
const serverUserExercises = new Map<string, UserExerciseProgressRecord[]>();
const serverUserProjects = new Map<string, UserCodingProjectRecord[]>();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'exercises' | 'project' | 'all'
    const language = searchParams.get('language') as 'python' | 'javascript' | 'java' | null;
    const projectId = searchParams.get('projectId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    if (type === 'exercises') {
      const records = serverUserExercises.get(userId) || [];
      // Row-Level Security: strict owner scoping
      const userRecords = records.filter((r) => r.userId === userId);
      if (language) {
        const matched = userRecords.find((r) => r.language === language);
        return NextResponse.json({ success: true, record: matched || null });
      }
      return NextResponse.json({ success: true, records: userRecords });
    }

    if (type === 'project') {
      const records = serverUserProjects.get(userId) || [];
      // Row-Level Security: strict owner scoping
      const userRecords = records.filter((p) => p.userId === userId);
      if (language && projectId) {
        const matched = userRecords.find((p) => p.language === language && p.projectId === projectId);
        return NextResponse.json({ success: true, record: matched || null });
      }
      if (language) {
        return NextResponse.json({ success: true, records: userRecords.filter((p) => p.language === language) });
      }
      return NextResponse.json({ success: true, records: userRecords });
    }

    // Default: return user data summary
    const exercises = (serverUserExercises.get(userId) || []).filter((r) => r.userId === userId);
    const projects = (serverUserProjects.get(userId) || []).filter((p) => p.userId === userId);
    return NextResponse.json({
      success: true,
      data: {
        userId,
        exercises,
        projects,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { userId, type, language, projectId, userAnswers, score, totalAnswered, code } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (type === 'exercises') {
      if (!language) {
        return NextResponse.json({ error: 'Missing language' }, { status: 400 });
      }
      const existing = serverUserExercises.get(userId) || [];
      const now = new Date().toISOString();
      const updatedList = existing.filter((r) => r.userId === userId && r.language !== language);
      const newRecord: UserExerciseProgressRecord = {
        id: `uexp_${userId}_${language}`,
        userId,
        language,
        userAnswers: userAnswers || {},
        score: typeof score === 'number' ? score : 0,
        totalAnswered: typeof totalAnswered === 'number' ? totalAnswered : Object.keys(userAnswers || {}).length,
        updatedAt: now,
      };
      updatedList.push(newRecord);
      serverUserExercises.set(userId, updatedList);

      return NextResponse.json({ success: true, record: newRecord });
    }

    if (type === 'project') {
      if (!language || !projectId) {
        return NextResponse.json({ error: 'Missing language or projectId' }, { status: 400 });
      }
      const existing = serverUserProjects.get(userId) || [];
      const now = new Date().toISOString();
      const updatedList = existing.filter((p) => !(p.userId === userId && p.language === language && p.projectId === projectId));
      const newRecord: UserCodingProjectRecord = {
        id: `uproj_${userId}_${language}_${projectId}`,
        userId,
        language,
        projectId,
        code: typeof code === 'string' ? code : '',
        updatedAt: now,
      };
      updatedList.push(newRecord);
      serverUserProjects.set(userId, updatedList);

      return NextResponse.json({ success: true, record: newRecord });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const language = searchParams.get('language') as 'python' | 'javascript' | 'java' | null;
    const projectId = searchParams.get('projectId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    if (type === 'exercises') {
      const existing = serverUserExercises.get(userId) || [];
      if (language) {
        serverUserExercises.set(userId, existing.filter((r) => !(r.userId === userId && r.language === language)));
      } else {
        serverUserExercises.delete(userId);
      }
      return NextResponse.json({ success: true, message: 'Exercise progress reset in database' });
    }

    if (type === 'project') {
      const existing = serverUserProjects.get(userId) || [];
      if (language && projectId) {
        serverUserProjects.set(userId, existing.filter((p) => !(p.userId === userId && p.language === language && p.projectId === projectId)));
      } else if (language) {
        serverUserProjects.set(userId, existing.filter((p) => !(p.userId === userId && p.language === language)));
      } else {
        serverUserProjects.delete(userId);
      }
      return NextResponse.json({ success: true, message: 'Project code reset in database' });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
