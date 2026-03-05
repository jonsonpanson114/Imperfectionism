'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { storage } from '@/lib/storage';
import { useLetGoItems } from '@/lib/storage/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function LetGoPage() {
  const letGoItems = useLetGoItems();
  const [content, setContent] = useState('');
  const [initialFeeling, setInitialFeeling] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [laterFeeling, setLaterFeeling] = useState('');
  const [laterNote, setLaterNote] = useState('');

  const handleAdd = () => {
    if (!content.trim()) return;

    storage.addLetGoItem({
      content: content.trim(),
      letGoAt: new Date().toISOString().split('T')[0],
      initialFeeling: initialFeeling.trim() || undefined,
    });

    setContent('');
    setInitialFeeling('');
  };

  const handleUpdateReflection = (id: string) => {
    storage.updateLetGoItem(id, {
      laterFeeling: laterFeeling.trim() || undefined,
      laterNote: laterNote.trim() || undefined,
    });
    setEditingId(null);
    setLaterFeeling('');
    setLaterNote('');
  };

  const handleDelete = (id: string) => {
    if (confirm('本当に削除しますか？')) {
      storage.deleteLetGoItem(id);
    }
  };

  const getDaysSinceLetGo = (letGoAt: string) => {
    const days = Math.floor(
      (new Date().getTime() - new Date(letGoAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const getReflectionStatus = (item: typeof letGoItems[0]) => {
    const days = getDaysSinceLetGo(item.letGoAt);
    if (item.laterFeeling) {
      return { status: 'done', label: '振り返り済み', color: 'bg-green-100 text-green-700' };
    }
    if (days >= 7) {
      return { status: 'due', label: '振り返り時', color: 'bg-orange-100 text-orange-700' };
    }
    if (days >= 3) {
      return { status: 'pending', label: '3日経過', color: 'bg-yellow-100 text-yellow-700' };
    }
    return { status: 'fresh', label: '直近', color: 'bg-blue-100 text-blue-700' };
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-2xl font-medium text-stone-800 mb-2">手放し</h1>
        <p className="text-stone-500">
          永遠にできないことを手放しましょう。
        </p>
      </motion.div>

      {/* 追加フォーム */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-white border-stone-100">
          <h2 className="text-lg font-medium text-stone-700 mb-4">
            手放すものを記録
          </h2>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="手放そうとしていること..."
            className="min-h-[100px] mb-4 bg-stone-50 border-stone-200 focus:ring-stone-300"
          />
          <Textarea
            value={initialFeeling}
            onChange={(e) => setInitialFeeling(e.target.value)}
            placeholder="手放した瞬間の気持ち（任意）..."
            className="min-h-[60px] mb-4 bg-stone-50 border-stone-200 focus:ring-stone-300"
          />
          <Button
            onClick={handleAdd}
            disabled={!content.trim()}
            className="w-full bg-stone-800 hover:bg-stone-700"
          >
            手放した
          </Button>
        </Card>
      </motion.div>

      {/* 手放しリスト */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-medium text-stone-700 mb-4">
          手放したこと（{letGoItems.length}件）
        </h2>

        <div className="space-y-4">
          {letGoItems.map((item) => {
            const reflection = getReflectionStatus(item);
            const days = getDaysSinceLetGo(item.letGoAt);
            const isEditing = editingId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-white border-stone-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={reflection.color}>{reflection.label}</Badge>
                      <span className="text-sm text-stone-400">{days}日前</span>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-stone-400 hover:text-stone-600 text-sm"
                    >
                      削除
                    </button>
                  </div>

                  <p className="text-stone-700 mb-2">{item.content}</p>
                  {item.initialFeeling && (
                    <p className="text-sm text-stone-500 mb-3">
                      手放した時の気持ち：「{item.initialFeeling}」
                    </p>
                  )}

                  {!item.laterFeeling && days >= 3 && (
                    <div className="mt-4 pt-4 border-t border-stone-100">
                      {isEditing ? (
                        <div className="space-y-3">
                          <Textarea
                            value={laterFeeling}
                            onChange={(e) => setLaterFeeling(e.target.value)}
                            placeholder="今の気持ちはどうですか？"
                            className="min-h-[60px] bg-stone-50 border-stone-200 focus:ring-stone-300"
                          />
                          <Textarea
                            value={laterNote}
                            onChange={(e) => setLaterNote(e.target.value)}
                            placeholder="気づいたことはありますか？（任意）"
                            className="min-h-[60px] bg-stone-50 border-stone-200 focus:ring-stone-300"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleUpdateReflection(item.id)}
                              className="flex-1 bg-stone-800 hover:bg-stone-700"
                            >
                              保存
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingId(null);
                                setLaterFeeling('');
                                setLaterNote('');
                              }}
                              variant="outline"
                              className="border-stone-300"
                            >
                              キャンセル
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setEditingId(item.id)}
                          variant="outline"
                          className="w-full border-stone-300 hover:bg-stone-50"
                        >
                          振り返る
                        </Button>
                      )}
                    </div>
                  )}

                  {item.laterFeeling && (
                    <div className="mt-4 pt-4 border-t border-stone-100 bg-green-50/50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
                      <p className="text-sm text-stone-600">
                        振り返り：「{item.laterFeeling}」
                      </p>
                      {item.laterNote && (
                        <p className="text-sm text-stone-500 mt-1">
                          {item.laterNote}
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {letGoItems.length === 0 && (
          <Card className="p-8 text-center bg-white border-stone-100">
            <p className="text-stone-400">
              まだ手放したことがありません。<br />
              永遠にできないことを手放しましょう。
            </p>
          </Card>
        )}
      </motion.div>

      {/* 手放しの意味 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <p className="text-stone-600 text-center">
            手放すことは、諦めではありません。<br />
            自分の限界を受け入れ、より重要なことに時間を使うことです。
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
