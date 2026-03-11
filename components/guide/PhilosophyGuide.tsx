'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { HelpCircle, Info, CheckCircle2, XCircle, Ban, Target, Wind, Trash2 } from 'lucide-react';

export function PhilosophyGuide() {
  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-stone-400" />
          <h2 className="text-xl font-medium text-stone-800">不完全主義とは</h2>
        </div>
        <p className="text-stone-600 leading-relaxed bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
          「人生はたった4000週間しかない」という冷酷な事実を受け入れることです。
          すべてを終わらせることは不可能です。だからこそ、
          <span className="font-semibold text-stone-800">「全部できない」ことを認め、
          何を選び、何を捨てるかを意識的に決める</span>ことで、私たちは焦りから解放されます。
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <GuideCard 
          icon={<Info className="w-5 h-5 text-blue-500" />}
          title="開放式リスト"
          purpose="脳のリソースを開放する"
          description="やるかどうかは別として、気になっていることをすべて書き出し、脳の外に追い出します。脳を「実行する場所」ではなく「通過する場所」にします。"
          example="「いつか行きたい場所」「将来の夢」「買わなきゃいけない洗剤」"
        />
        <GuideCard 
          icon={<Target className="w-5 h-5 text-green-500" />}
          title="3つの選択"
          purpose="意図的な優先順位付け"
          description="「やる・やらない・受け入れる」を明確に決めます。やることは3つに絞り、それ以外を諦める勇気を持ちます。"
          example="「今日はこれだけやる」「今日はSNSを見ない」「納期が遅れるのは仕方ないと認める」"
        />
        <GuideCard 
          icon={<CheckCircle2 className="w-5 h-5 text-purple-500" />}
          title="不完全な達成"
          purpose="完了ではなく「前進」を祝う"
          description="タスクが完璧に終わらなくても、動いた事実を記録します。未完成のまま世に出す、あるいは途中でやめる不完全さを肯定します。"
          example="「本を1ページだけ読んだ」「資料の構成案だけ書いた」"
        />
        <GuideCard 
          icon={<Wind className="w-5 h-5 text-cyan-500" />}
          title="無為"
          purpose="生産性の奴隷からの脱却"
          description="何もしない時間をあえて設けます。「何かをしなくては」という焦りを静め、ただ存在することを自分に許します。"
        />
        <GuideCard 
          icon={<Trash2 className="w-5 h-5 text-red-400" />}
          title="手放し"
          purpose="現実的な限界を認める"
          description="「いつかやる」と思いながら放置していた重荷を、永遠に捨て去ります。持ち物を減らすように、タスクも捨てていきます。"
          example="「数年前から溜めている資格の勉強」「使いこなせていないツール」"
        />
      </div>
    </div>
  );
}

function GuideCard({ icon, title, purpose, description, example }: { 
  icon: React.ReactNode, 
  title: string, 
  purpose: string, 
  description: string, 
  example?: string 
}) {
  return (
    <Card className="p-4 border-stone-100 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-semibold text-stone-800">{title}</h3>
      </div>
      <p className="text-xs font-medium text-stone-400 mb-2 uppercase tracking-wider">{purpose}</p>
      <p className="text-sm text-stone-600 mb-3">{description}</p>
      {example && (
        <div className="text-xs bg-stone-50 p-2 rounded text-stone-500 italic">
          例：{example}
        </div>
      )}
    </Card>
  );
}
