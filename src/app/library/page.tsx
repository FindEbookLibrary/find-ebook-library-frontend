'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import {
  Button,
  IconBuilding,
  IconCheck,
  IconCheckCircle,
  IconClock,
  IconLock,
  IconMap,
  IconSchool,
  IconSearch,
  IconShield,
  IconTrash,
  PlatformDot,
} from '@components/ui';
import { libraryService } from '@lib/services/library.service';
import { getLibraryTypeLabel } from '@lib/utils/libraryUi';
import { Library } from '@/types/library.types';
import { AffiliationUIType } from '@/types/ui.types';
import { useUserStore } from '@stores/userStore';
import { getMockPlatformById } from '@lib/mock/data';

const AFFILIATION_OPTIONS: {
  id: AffiliationUIType;
  label: string;
  sub: string;
  icon: ReactNode;
}[] = [
  {
    id: 'university',
    label: '대학교',
    sub: '소속 학교 도서관',
    icon: <IconSchool size={20} />,
  },
  {
    id: 'company',
    label: '회사/기관',
    sub: '재직 중인 회사',
    icon: <IconBuilding size={20} />,
  },
  {
    id: 'region',
    label: '지역 주민',
    sub: '거주지 / 시군구',
    icon: <IconMap size={20} />,
  },
  {
    id: 'public',
    label: '공공도서관 회원',
    sub: '공공도서관 회원증',
    icon: <IconShield size={20} />,
  },
];

export default function LibraryPage() {
  const router = useRouter();
  const accessibleLibraries = useUserStore((state) => state.accessibleLibraries);
  const interestLibraryCodes = useUserStore((state) => state.interestLibraryCodes);
  const affiliationType = useUserStore((state) => state.affiliationType);
  const setAccessibleLibraries = useUserStore((state) => state.setAccessibleLibraries);
  const setInterestLibraries = useUserStore((state) => state.setInterestLibraries);
  const setAffiliationType = useUserStore((state) => state.setAffiliationType);

  const [searchValue, setSearchValue] = useState('');
  const [selectedAffiliation, setSelectedAffiliation] = useState<AffiliationUIType>(
    affiliationType ?? 'university'
  );
  const [selectedLibraryCodes, setSelectedLibraryCodes] = useState<string[]>(
    interestLibraryCodes
  );

  useEffect(() => {
    const loadLibraries = async () => {
      if (accessibleLibraries.length > 0) {
        return;
      }

      const libraries: Library[] = await libraryService.getAccessibleLibraries();
      setAccessibleLibraries(libraries);
    };

    void loadLibraries();
  }, [accessibleLibraries.length, setAccessibleLibraries]);

  useEffect(() => {
    setSelectedLibraryCodes(interestLibraryCodes);
  }, [interestLibraryCodes]);

  const suggestedLibraries = useMemo(() => {
    const librariesByAffiliation: Record<AffiliationUIType, string[]> = {
      university: ['대학교'],
      company: ['회사/기관'],
      region: ['시/군/구'],
      public: ['공공도서관'],
    };

    const allowedTypes = librariesByAffiliation[selectedAffiliation];
    const normalizedKeyword = searchValue.trim().toLowerCase();

    return accessibleLibraries.filter((library) => {
      const typeLabel = getLibraryTypeLabel(library.type);
      const matchesType = allowedTypes.includes(typeLabel);
      const matchesKeyword =
        !normalizedKeyword ||
        library.libName.toLowerCase().includes(normalizedKeyword) ||
        (library.region ?? '').toLowerCase().includes(normalizedKeyword);

      return matchesType && matchesKeyword;
    });
  }, [accessibleLibraries, searchValue, selectedAffiliation]);

  const selectedLibraries = useMemo(
    () =>
      accessibleLibraries.filter((library) =>
        selectedLibraryCodes.includes(library.libCode)
      ),
    [accessibleLibraries, selectedLibraryCodes]
  );

  const toggleLibrary = (libCode: string) => {
    setSelectedLibraryCodes((current) =>
      current.includes(libCode)
        ? current.filter((code) => code !== libCode)
        : [...current, libCode]
    );
  };

  const saveSelection = () => {
    setInterestLibraries(selectedLibraryCodes);
    setAffiliationType(selectedAffiliation);

    startTransition(() => {
      router.push('/');
    });
  };

  const placeholderText =
    selectedAffiliation === 'university'
      ? '학교명을 입력하세요 (예: OO대학교)'
      : selectedAffiliation === 'company'
        ? '회사명을 입력하세요'
        : selectedAffiliation === 'region'
          ? '시/군/구를 입력하세요 (예: 강남구)'
          : '공공도서관명을 입력하세요';

  return (
    <div className="mx-auto max-w-[1080px] px-5 py-10 md:px-8">
      <div className="mb-8">
        <div className="mono mb-2 text-[11px] tracking-wider text-brand-600">
          MY LIBRARY
        </div>
        <h1 className="text-[28px] font-bold tracking-tight text-ink-900 md:text-[32px]">
          내가 이용할 수 있는 도서관을 설정하세요.
        </h1>
        <p className="mt-2 max-w-[640px] text-[14.5px] text-ink-600">
          소속 정보를 기준으로 실제 이용 가능한 전자도서관만 검색 결과에 우선 표시할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-[14px] font-semibold text-ink-900">
              1. 소속 유형 선택
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {AFFILIATION_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedAffiliation(option.id)}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${
                    selectedAffiliation === option.id
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-ink-200 bg-white hover:border-brand-300'
                  }`}
                >
                  <div
                    className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${
                      selectedAffiliation === option.id
                        ? 'bg-brand-600 text-white'
                        : 'bg-ink-100 text-ink-700'
                    }`}
                  >
                    {option.icon}
                  </div>
                  <div className="text-[14px] font-semibold text-ink-900">
                    {option.label}
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-ink-500">{option.sub}</div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[14px] font-semibold text-ink-900">
              2. 학교 / 회사 / 지역 검색
            </h2>
            <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white p-2">
              <div className="pl-2 text-ink-500">
                <IconSearch size={18} />
              </div>
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={placeholderText}
                className="h-10 flex-1 bg-transparent px-2 text-[14px] outline-none"
              />
            </div>

            <div className="mt-3 space-y-2">
              {suggestedLibraries.length === 0 ? (
                <div className="px-2 py-3 text-[12.5px] text-ink-500">
                  검색 결과가 없습니다.
                </div>
              ) : (
                suggestedLibraries.map((library) => {
                  const selected = selectedLibraryCodes.includes(library.libCode);
                  const platform = getMockPlatformById(library.platform);

                  return (
                    <button
                      key={library.libCode}
                      type="button"
                      onClick={() => toggleLibrary(library.libCode)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                        selected
                          ? 'border-brand-600 bg-brand-50'
                          : 'border-ink-200 bg-white hover:border-brand-300'
                      }`}
                    >
                      <div className="stripe-logo flex h-10 w-10 items-center justify-center rounded-lg bg-ink-50">
                        {platform ? <PlatformDot p={platform} size={22} /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-medium text-ink-900">
                          {library.libName}
                        </div>
                        <div className="mt-0.5 text-[11.5px] text-ink-500">
                          {getLibraryTypeLabel(library.type)} · {library.region}
                          {platform ? ` · ${platform.name}` : ''}
                        </div>
                      </div>
                      {library.authNeeded && !selected ? (
                        <span className="rounded-full bg-accent-warnBg px-2 py-0.5 text-[11px] text-accent-warn">
                          인증 필요
                        </span>
                      ) : null}
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          selected
                            ? 'border-brand-600 bg-brand-600 text-white'
                            : 'border-ink-300'
                        }`}
                      >
                        {selected ? <IconCheck size={12} sw={3} /> : null}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[14px] font-semibold text-ink-900">
              3. 도서관 회원 인증 상태
            </h2>
            <div className="divide-y divide-ink-100 rounded-xl border border-ink-200 bg-white">
              {selectedLibraries.length === 0 ? (
                <div className="p-6 text-center text-[13px] text-ink-500">
                  아직 선택한 도서관이 없습니다.
                </div>
              ) : (
                selectedLibraries.map((library) => {
                  const platform = getMockPlatformById(library.platform);

                  return (
                    <div key={library.libCode} className="flex items-center gap-3 p-4">
                      {platform ? <PlatformDot p={platform} size={26} /> : null}
                      <div className="min-w-0 flex-1">
                        <div className="text-[13.5px] font-medium text-ink-900">
                          {library.libName}
                        </div>
                        <div className="text-[11.5px] text-ink-500">
                          {platform?.name ?? '연동 플랫폼'}
                        </div>
                      </div>
                      {library.authNeeded ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-warnBg px-2 py-1 text-[12px] text-accent-warn">
                          <IconLock size={12} /> 인증 필요
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-okBg px-2 py-1 text-[12px] text-accent-ok">
                          <IconCheckCircle size={12} /> 인증 완료
                        </span>
                      )}
                      <button type="button" className="ml-2 text-[12px] text-brand-700 hover:underline">
                        인증하기
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        <aside>
          <div className="sticky top-[80px] rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold text-ink-900">선택된 도서관</div>
              <span className="num text-[12px] text-ink-500">{selectedLibraries.length}곳</span>
            </div>

            {selectedLibraries.length === 0 ? (
              <div className="py-6 text-center text-[12.5px] text-ink-500">
                도서관을 선택하면 여기에 표시됩니다.
              </div>
            ) : (
              <div className="space-y-2">
                {selectedLibraries.map((library) => {
                  const platform = getMockPlatformById(library.platform);

                  return (
                    <div
                      key={library.libCode}
                      className="flex items-start gap-2.5 rounded-lg bg-ink-50 p-3"
                    >
                      {platform ? <PlatformDot p={platform} size={20} /> : null}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium text-ink-900">
                          {library.libName}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-500">
                          <IconClock size={11} />
                          마지막 동기화: {library.lastSync}
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          {library.authNeeded ? (
                            <span className="rounded px-1.5 py-0.5 text-[10.5px] text-accent-warn bg-accent-warnBg">
                              인증 필요
                            </span>
                          ) : (
                            <span className="rounded px-1.5 py-0.5 text-[10.5px] text-accent-ok bg-accent-okBg">
                              이용 가능
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleLibrary(library.libCode)}
                        className="text-ink-400 hover:text-accent-err"
                        title="삭제"
                      >
                        <IconTrash size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-5 border-t border-ink-100 pt-4">
              <Button onClick={saveSelection} className="w-full" size="md">
                저장하기 ({selectedLibraries.length}곳)
              </Button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="mt-2 h-10 w-full text-[13px] text-ink-600 hover:text-ink-900"
              >
                나중에 설정하기
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
